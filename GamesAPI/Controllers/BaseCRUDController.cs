using Bng.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Bng.GamesAPI.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OData.Query;

namespace Bng.GamesAPI.Controllers
{
    public abstract class BaseCRUDController<TController, TModel> : ControllerBase
        where TController : BaseCRUDController<TController, TModel>
        where TModel : class, IEntity
    {
        private AppDBContext _context;
        private ILogger<TController> _logger;


        protected AppDBContext Context => _context ??= HttpContext.RequestServices.GetService<AppDBContext>();
        protected ILogger<TController> Logger => _logger ??= HttpContext.RequestServices.GetService<ILogger<TController>>();

        [HttpGet("{id}")]
        public virtual async Task<object> Get(int id)
        {
            return await this.Context.FindAsync<TModel>(id);
        }

        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] TModel model)
        {
            try
            {
                await this.Context.AddAsync<TModel>(model);
                await this.Context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Logger.LogError($"Can't add model(Id = {model.Id}, Type = {typeof(TModel).Name}) to DB. Exception message: {ex.Message}");
                return StatusCode(400, ex);
            }
            return StatusCode(200, model.Id);
        }

        [HttpPut("{id}")]
        public virtual async Task<IActionResult> Put(int id, [FromBody] TModel model)
        {
            var entity = await this.Context.FindAsync<TModel>(id);
            if (entity != null)
            {
                try
                {
                    this.Context.Entry<TModel>(entity).State = Microsoft.EntityFrameworkCore.EntityState.Detached;
                    entity = model;
                    entity.Id = id;
                    this.Context.Update<TModel>(entity);
                    await this.Context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Logger.LogError($"Can't update model(Id = {model.Id}, Type = {typeof(TModel).Name}) to DB. Exception message: {ex.Message}");
                    return StatusCode(400, ex);
                }
                return StatusCode(200, entity.Id);
            }
            return StatusCode(404, $"Entity with Id = {model.Id} not found");
        }

        [HttpDelete("{id}")]
        public virtual async Task<StatusCodeResult> Delete(int id)
        {
            var model = await this.Context.FindAsync<TModel>(id);
            if (model != null)
            {
                this.Context.Remove<TModel>(model);
                await this.Context.SaveChangesAsync();
                return StatusCode(200);
            }
            else
                return StatusCode(413);
        }

        [HttpGet("Query")]
        [EnableQuery]
        public virtual IQueryable<TModel> Query()
        {
            try
            {
                return this.Context.Set<TModel>().AsNoTracking();
            }
            catch (Exception e)
            {
                Logger.LogError(e, "Error while executing get query request. ");
            }
            return null;
        }

    }
}
