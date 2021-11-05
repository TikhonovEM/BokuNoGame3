using Bng.GamesAPI.Models;
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
    public class ReviewController : BaseCRUDController<ReviewController, Review>
    {

    }
}
