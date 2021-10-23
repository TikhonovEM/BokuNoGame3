using GamesAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace GamesAPI.Controllers
{
    public abstract class BaseCRUDController<TController, TModel> : ControllerBase 
        where TController : BaseCRUDController<TController, TModel>
        where TModel : class
    {
        private AppDBContext _context;
        private ILogger<TController> _logger;
        

        protected AppDBContext Context => _context ??= HttpContext.RequestServices.GetService<AppDBContext>();
        protected ILogger<TController> Logger => _logger ??= HttpContext.RequestServices.GetService<ILogger<TController>>();

        // GET api/<GameController>/5
        [HttpGet("{id}")]
        public async Task<object> Get(int id)
        {
            return await this.Context.FindAsync<TModel>(id);
        }

        // POST api/<GameController>
        [HttpPost]
        public async Task<StatusCodeResult> Post([FromBody] TModel model)
        {
            try
            {
                await this.Context.AddAsync<TModel>(model);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Can't add to DB. Exception message: {ex.Message}");
                return StatusCode(400);
            }
            return StatusCode(200);
        }

        // PUT api/<GameController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<GameController>/5
        [HttpDelete("{id}")]
        public async Task<StatusCodeResult> Delete(int id)
        {
            var model = await this.Context.FindAsync<TModel>(id);
            if (model != null)
            {
                _context.Remove<TModel>(model);
                return StatusCode(200);
            }
            else
                return StatusCode(413);
        }

    }
}
