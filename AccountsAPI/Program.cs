using Bng.AccountsAPI.Contexts;
using Bng.AccountsAPI.Models;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.AccountsAPI
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var logger = NLog.Web.NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
            try
            {
                var webHost = BuildWebHost(args);

                using (var scope = webHost.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;

                    try
                    {
                        var userManager = services.GetRequiredService<UserManager<User>>();
                        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
                        var context = services.GetService<AppDBContext>();
                        await Helpers.InitializationService.InitializeAsync(userManager, roleManager, context);
                    }
                    catch
                    {

                    }

                }

                webHost.Run();
            }
            catch (Exception e)
            {
                //NLog: catch setup errors
                logger.Error(e, "Stopped program because of exception");
                throw;
            }
            finally
            {
                NLog.LogManager.Shutdown();
            }
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
             .UseStartup<Startup>()
             .ConfigureLogging(logging =>
             {
                 logging.ClearProviders();
                 logging.SetMinimumLevel(LogLevel.Trace);
             })
            .UseNLog()
            .Build();
        }
    }
}
