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
    public class GameController : BaseCRUDController<GameController, Game>
    {

    }
}
