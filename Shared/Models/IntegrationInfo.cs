using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.Shared.Models
{
    public class IntegrationInfo : IEntity
    {
        public int Id { get; set; }
        public string ExternalSystemDescriptor { get; set; }
        public int ExternalGameId { get; set; }
        public string ExternalGameIdStr { get; set; }
        public int? InternalGameId { get; set; }
        public bool HasErrors { get; set; }
        public DateTime Date { get; set; }
    }
}
