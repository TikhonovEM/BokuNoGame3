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
