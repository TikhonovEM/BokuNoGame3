using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.Shared.Models
{
    public class GameRate : IEntity
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public int Rate { get; set; }
        public string AuthorId { get; set; }
    }
}
