using Bng.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.GamesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameRateController : BaseCRUDController<GameRateController, GameRate>
    {

        /// <summary>
        /// Получить средний рейтинг игры.
        /// </summary>
        /// <param name="gameId">ИД игры.</param>
        /// <returns></returns>
        /// <remarks>Вынесен в отдельный метод, т.к. aggregate из OData не работает в EF Core ниже 6 версии, а EF Core 6 несовместим с .net5.</remarks>
        [HttpGet("Average/{gameId}")]
        public virtual async Task<double> GetAverageRate(int gameId)
        {
            var rates = Context.GameRates.Where(gr => gr.GameId == gameId).Select(gr => gr.Rate);
            if (rates.Count() > 0)
                return Math.Round(await rates.AverageAsync(), 2);

            return 0;
        }

        public override async Task<IActionResult> Put(int id, [FromBody] GameRate model)
        {
            var result = await base.Put(id, model);

            await UpdateRateInGameSummaryAsync(result, model);

            return result;
        }

        public override async Task<IActionResult> Post([FromBody] GameRate model)
        {
            var result = await base.Post(model);

            await UpdateRateInGameSummaryAsync(result, model);

            return result;
        }

        private async Task UpdateRateInGameSummaryAsync(IActionResult result, GameRate model)
        {
            if ((result as ObjectResult)?.StatusCode == 200)
            {
                var gs = await Context.GameSummaries.FirstOrDefaultAsync(gs => gs.UserId == model.AuthorId && gs.GameId == model.GameId);
                if (gs is not null)
                {
                    gs.Rate = model.Rate;
                    await Context.SaveChangesAsync();
                }
            }
        }
    }
}
