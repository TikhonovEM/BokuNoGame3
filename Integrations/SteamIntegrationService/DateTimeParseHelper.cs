using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bng.SteamIntegrationService
{
    public static class DateTimeParseHelper
    {
        public static string[] AvailableFormats { get; } = 
        {
            "dd.MM.yyyy",
            "dd.M.yyyy"
        };
    }
}
