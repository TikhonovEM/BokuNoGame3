using GamesAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly ILogger<GameController> _logger;

        public GameController(AppDBContext context, ILogger<GameController> logger)
        {
            _context = context;
            _logger = logger;
        }


        // GET api/<GameController>/5
        [HttpGet("{id}")]
        public async Task<object> Get(int id)
        {
            return await _context.Games.FindAsync(id);
        }

        // POST api/<GameController>
        [HttpPost]
        public async Task<StatusCodeResult> Post([FromBody] Game game)
        {
            try
            {
                await _context.Games.AddAsync(game);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Can't add game to DB. Exception message: {ex.Message}");
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
            var game = await _context.Games.FindAsync(id);
            if (game != null)
            {
                _context.Games.Remove(game);
                return StatusCode(200);
            }
            else
                return StatusCode(413);
        }
    }
}
