using Bng.Shared.Models;
using Microsoft.AspNetCore.Http;
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
    public class GameSummaryController : BaseCRUDController<GameSummaryController, GameSummary>
    {
        [HttpGet("User/{userid?}")]
        public object GetGameSummariesByUser(string userid)
        {
            return this.Context.GameSummaries.Where(gs => gs.UserId.Equals(userid));
        }

        public override async Task<IActionResult> Post([FromBody] GameSummary model)
        {
            var result = await base.Post(model);

            if ((result as ObjectResult)?.StatusCode == 200)
            {
                var gr = await Context.GameRates.FirstOrDefaultAsync(gr => gr.AuthorId == model.UserId && gr.GameId == model.GameId);
                if (gr is not null)
                {
                    var gs = await Context.GameSummaries.FirstOrDefaultAsync(gs => gs.UserId == model.UserId && gs.GameId == model.GameId);
                    gs.Rate = gr.Rate;
                    await Context.SaveChangesAsync();
                }
            }

            return result;
        }
    }
}
