using GamesAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameRateController : BaseCRUDController<GameRateController, GameRate>
    {

    }
}
