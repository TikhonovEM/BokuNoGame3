using Bng.GamesAPI.Contexts;
using Bng.GamesAPI.Domain;
using Bng.GamesAPI.Extensions;
using Bng.Shared.Models;
using Bng.Shared.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.GamesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameListController : ControllerBase
    {
        private readonly AppDBContext _context;

        public GameListController(AppDBContext context)
        {
            _context = context;
        }

        [HttpGet("{page}-{filterStateAsJson}")]
        public object GameList(int page, string filterStateAsJson)
        {
            var filterState = JsonConvert.DeserializeObject<FilterState>(filterStateAsJson);
            var filteredList = _context.Games.ApplyFilter(filterState);
            var pagination = new Page(filteredList.Count(), page);
            var gamesPage = filteredList
                .TruncateToPage(pagination)
                .Select(g => new
                {
                    g.Id,
                    g.Logo,
                    g.Name
                });

            return new
            {
                games = gamesPage,
                pagination
            };
        }

        [HttpGet("FilterData")]
        public object FilterData()
        {
            return new
            {
                Publishers = _context.Games.Select(g => g.Publisher).Distinct().ToList(),
                Developers = _context.Games.Select(g => g.Developer).Distinct().ToList(),
                StartYears = Enumerable.Range(1900, DateTime.Now.Year - 1899),
                EndYears = Enumerable.Range(1900, DateTime.Now.Year - 1899),
                AgeRatings = _context.Games.Select(g => g.AgeRating).Distinct().ToList(),
                Genres = Enum.GetValues(typeof(Genre)).Cast<Genre>().ToDictionary(t => (int)t, t => t.GetAttribute<DisplayAttribute>().Name)
            };
        }
    }
}
