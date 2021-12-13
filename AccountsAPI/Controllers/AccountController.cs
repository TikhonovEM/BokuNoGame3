using Bng.AccountsAPI.Contexts;
using Bng.AccountsAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

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
        public AccountController(UserManager<User> userManager,
            SignInManager<User> signInManager, RoleManager<IdentityRole> roleManager, AppDBContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(Credentials credentials)
        {
            var result = 
                await _signInManager.PasswordSignInAsync(credentials.Login, credentials.Password, credentials.RememberMe, false);            
            if (result.Succeeded)
                return RedirectToAction("UserInfo");

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
            var user = new User { UserName = credentials.Login };
            //user.Photo = System.IO.File.ReadAllBytes(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Files", "default-avatar.jpg"));
            // добавляем пользователя
            var result = await _userManager.CreateAsync(user, credentials.Password);
            if (result.Succeeded)
            {
                // установка куки
                await _userManager.AddToRoleAsync(user, "User");
                await _signInManager.SignInAsync(user, false);
                return Ok(await UserInfo());
            }
            else
                return StatusCode(400, new { Errors = result.Errors.Select(e => e.Description) });
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
                UserId = user?.Id
            };
        }

        [HttpGet("{username?}")]
        public IActionResult Profile(string username)
        {
            return Ok();
        }
    }
}
