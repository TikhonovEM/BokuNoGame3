using Bng.Shared.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}
