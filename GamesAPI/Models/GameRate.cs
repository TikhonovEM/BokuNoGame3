using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.GamesAPI.Models
{
    public class GameRate
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public int Rate { get; set; }
        public string AuthorId { get; set; }
    }
}
