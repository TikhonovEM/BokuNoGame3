using Bng.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Bng.GamesAPI.Contexts;

namespace Bng.GamesAPI.Controllers
{
    public abstract class BaseCRUDController<TController, TModel> : ControllerBase 
        where TController : BaseCRUDController<TController, TModel>
        where TModel : class
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
        public virtual async Task<StatusCodeResult> Post([FromBody] TModel model)
        {
            try
            {
                await this.Context.AddAsync<TModel>(model);
                await this.Context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Logger.LogError($"Can't add to DB. Exception message: {ex.Message}");
                return StatusCode(400);
            }
            return StatusCode(200);
        }

        [HttpPut("{id}")]
        public virtual void Put(int id, [FromBody] TModel model)
        {
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

    }
}
