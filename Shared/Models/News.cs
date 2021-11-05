using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.Shared.Models
{
    public class News
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string Reference { get; set; }
        public bool IsLocal { get; set; }
    }
}
