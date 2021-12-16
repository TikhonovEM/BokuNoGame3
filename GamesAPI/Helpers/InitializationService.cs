using Bng.GamesAPI.Contexts;
using Bng.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.GamesAPI.Helpers
{
    public static class InitializationService
    {
        public static async Task InitializeAsync(AppDBContext context)
        {
            var catalogs = new List<string>()
            {
                "Запланировано",
                "Играю на данный момент",
                "Пройдено",
                "Брошено"
            };
            foreach (var catalogName in catalogs)
            {
                if (!context.Catalogs.Any(c => c.Name.Equals(catalogName)))
                {
                    var catalog = new Catalog()
                    {
                        Name = catalogName
                    };
                    context.Catalogs.Add(catalog);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
