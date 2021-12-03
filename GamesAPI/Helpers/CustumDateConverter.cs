using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;

namespace Bng.Bng.GamesAPI.Helpers
{
    public static class CustumDateConverter
    {
        private static List<string> _formats = new List<string>()
        {
            ""
        };
        public static DateTime Convert(string customDate)
        {
            if (DateTime.TryParseExact(customDate, _formats.ToArray(), CultureInfo.InvariantCulture, DateTimeStyles.None, out var convertedDate))
                return convertedDate;
            return default;
        }
    }
}
