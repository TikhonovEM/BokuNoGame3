using Bng.AccountsAPI.Models;
using Bng.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Bng.AccountsAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public ProfileController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpGet("{username?}")]
        public async Task<object> Profile(string username)
        {
            var user = username != null && !username.Equals("undefined") ? await _userManager.FindByNameAsync(username) : await _userManager.GetUserAsync(User);

            using var client = new HttpClient();
            client.BaseAddress = new Uri(Startup.Configuration["GamesAPIBaseAddress"]);

            var gameSummaries = JsonConvert.DeserializeObject<List<GameSummary>>(await client.GetStringAsync($"/api/GameSummary/User/{user.Id}"));

            var catalogs = JsonConvert.DeserializeObject<List<Catalog>>(await client.GetStringAsync("/api/Catalog/All"));

            return new
            {
                user,
                gameSummaries,
                catalogs
            };
        }
    }
}
