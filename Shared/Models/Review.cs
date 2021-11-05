using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.Shared.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string UserId { get; set; }
        public int GameId { get; set; }
        public DateTime Date { get; set; }
        public bool IsApproved { get; set; }
    }
}
