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
using Bng.AccountsAPI.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace Bng.AccountsAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ILogger<AuthController> _logger;
        private readonly IAuthService _authService;
        public AuthController(UserManager<User> userManager, ILogger<AuthController> logger, IAuthService authService)
        {
            _userManager = userManager;
            _logger = logger;
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] Credentials credentials)
        {
            var response = await _authService.Authenticate(credentials, IpAddress());

            if (response == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            SetTokenCookie(response.RefreshToken);

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RevokeTokenRequest model)
        {
            var refreshToken = model.Token ?? Request.Cookies["refreshToken"];
            var response = await _authService.RefreshToken(refreshToken, IpAddress());

            if (response == null)
                return Unauthorized(new { message = "Invalid token" });

            SetTokenCookie(response.RefreshToken);

            return Ok(response);
        }

        [HttpPost("revoke-token")]
        public IActionResult RevokeToken([FromBody] RevokeTokenRequest model)
        {
            // accept token from request body or cookie
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            var response = _authService.RevokeToken(token, IpAddress());

            if (!response)
                return NotFound(new { message = "Token not found" });

            return Ok(new { message = "Token revoked" });
        }

        [HttpPost("validate-token")]
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

                return Ok(new { username, roles });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An error occured while validating token: ");
                return null;
            }
        }

        [AllowAnonymous]
        [HttpPost("register")]
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
                    var response = await _authService.Authenticate(credentials, IpAddress());
                    SetTokenCookie(response.RefreshToken);

                    return Ok(response);
                }
                else
                    return StatusCode(500, new { Errors = result.Errors.Select(e => e.Description) });
            }
            catch(Exception e)
            {
                return StatusCode(501, new { Errors = new List<string>() { e.Message } });
            }
        }

        private void SetTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.Add(TimeSpan.Parse(Startup.Configuration["JWT:RefreshTokenLifetime"]))
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        private string IpAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}
