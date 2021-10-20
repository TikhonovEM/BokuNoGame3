using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAPI.Models
{
    public class IntegrationInfo
    {
        public int Id { get; set; }
        public string ExternalSystemDescriptor { get; set; }
        public int ExternalGameId { get; set; }
        public string ExternalGameIdStr { get; set; }
        public int InternalGameId { get; set; }
        public DateTime Date { get; set; }
    }
}
