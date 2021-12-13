using Bng.AccountsAPI.Contexts;
using Bng.AccountsAPI.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.AccountsAPI.Helpers
{
    public static class InitializationService
    {
        public static async Task InitializeAsync(UserManager<User> userManager, 
            RoleManager<IdentityRole> roleManager, 
            AppDBContext context)
        {
            var roles = new List<string>()
            {
                "Admin",
                "User"
            };
            foreach (var role in roles)
            {
                if (await roleManager.FindByNameAsync(role) == null)
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
            var adminLogin = Startup.Configuration["AdminLogin"];
            var adminPass = Startup.Configuration["AdminPassword"];
            var adminFIO = Startup.Configuration["AdminFullName"];
            var adminBirthdate = DateTime.Parse(Startup.Configuration["AdminBirthDate"]);

            if (await userManager.FindByNameAsync(adminLogin) == null)
            {
                var admin = new User()
                {
                    UserName = adminLogin,
                    FullName = adminFIO,
                    BirthDate = adminBirthdate
                };
                var result = await userManager.CreateAsync(admin, adminPass);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                    await userManager.AddToRoleAsync(admin, "User");
                }
            }
        }
    }
}
