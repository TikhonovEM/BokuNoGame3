using Bng.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.GamesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : BaseCRUDController<GameController, Game>
    {
        [HttpGet("MostPopular")]
        public object GetTopMostPopularGames(int top)
        {
            return Context.Games
                .OrderByDescending(g => Context.GameSummaries.Where(gs => gs.GameId == g.Id && gs.CatalogId == 2).Count())
                .Take(top)
                .Select(g => new
                {
                    g.Id,
                    g.Name,
                    g.Logo
                })
                .ToList();
        }
    }
}
