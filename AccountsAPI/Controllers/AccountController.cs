using Bng.AccountsAPI.Contexts;
using Bng.AccountsAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Bng.Shared.Models;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Bng.AccountsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDBContext _context;
        private readonly ILogger<AccountController> _logger;
        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, 
            RoleManager<IdentityRole> roleManager, AppDBContext context, ILogger<AccountController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _context = context;
            _logger = logger;
        }

        [HttpPost("Token")]
        public async Task<IActionResult> Token([FromBody] Credentials credentials)
        {
            var identity = await GetIdentity(credentials);
            if (identity == null)
            {
                return BadRequest(new { errorText = "Invalid username or password." });
            }

            var now = DateTime.UtcNow;
            var jwtConfig = Startup.Configuration.GetSection("JWT");
            // создаем JWT-токен
            var jwt = new JwtSecurityToken(
                    issuer: jwtConfig["Issuer"],
                    audience: jwtConfig["Audience"],
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromMinutes(int.Parse(jwtConfig["Lifetime"]))),
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig["Secret"])), 
                    SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                username = identity.Name,
                roles = identity.Claims.First(x => x.Type == ClaimsIdentity.DefaultRoleClaimType).Value
            };

            return Ok(response);
        }

        private async Task<ClaimsIdentity> GetIdentity(Credentials credentials)
        {
            var user = await _userManager.FindByNameAsync(credentials.Login);
            if (user != null && await _userManager.CheckPasswordAsync(user, credentials.Password))
            {
                var roles = await _userManager.GetRolesAsync(user);
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, user.UserName),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, string.Join(", ", roles))
                };
                var claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);
                return claimsIdentity;
            }

            // если пользователя не найдено
            return null;
        }

        [HttpPost("ValidateToken")]
        public IActionResult ValidateJwtToken([FromBody] string token)
        {
            var jwtConfig = Startup.Configuration.GetSection("JWT");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtConfig["Secret"]);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = jwtConfig["Issuer"],
                    ValidAudience = jwtConfig["Audience"]
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var username = jwtToken.Claims.First(x => x.Type == ClaimsIdentity.DefaultNameClaimType).Value;
                var roles = jwtToken.Claims.First(x => x.Type == ClaimsIdentity.DefaultRoleClaimType).Value;

                // return account id from JWT token if validation successful
                return Ok(new { username, roles });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An error occured while validating token: ");
                // return null if validation fails
                return null;
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(Credentials credentials)
        {
            _logger.LogInformation($"Start login for {credentials.Login}");
            var result =
                await _signInManager.PasswordSignInAsync(credentials.Login, credentials.Password, credentials.RememberMe, false);
            if (result.Succeeded)
            {
                _logger.LogInformation($"Successful login for {credentials.Login}");
                return RedirectToAction("UserInfo");
            }

            return StatusCode(400);
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] Credentials credentials)
        {
            try
            {
                _logger.LogInformation($"Start register for {credentials.Login}");
                var user = new User { UserName = credentials.Login };
                user.Photo = System.IO.File.ReadAllBytes(Path.Combine(Directory.GetCurrentDirectory(), "Files", "default-avatar.jpg"));
                // добавляем пользователя
                var result = await _userManager.CreateAsync(user, credentials.Password);
                if (result.Succeeded)
                {
                    _logger.LogInformation($"New user for {credentials.Login} registered");
                    // установка куки
                    await _userManager.AddToRoleAsync(user, "User");
                    await _signInManager.SignInAsync(user, false);
                    _logger.LogInformation($"New user for {credentials.Login} login");
                    return RedirectToAction("UserInfo");
                }
                else
                    return StatusCode(500, new { Errors = result.Errors.Select(e => e.Description) });
            }
            catch(Exception e)
            {
                return StatusCode(501, new { Errors = new List<string>() { e.Message } });
            }
        }

        [HttpGet("UserInfo")]
        public async Task<object> UserInfo()
        {
            var roles = new List<string>();
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
                roles.AddRange(await _userManager.GetRolesAsync(user));
            return new
            {
                IsSignedIn = _signInManager.IsSignedIn(User),
                Roles = roles,
                UserId = user?.Id,
                UserNickname = user?.Nickname
            };
        }

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
