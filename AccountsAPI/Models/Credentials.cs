using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.AccountsAPI.Models
{
    public class Credentials
    {
        public string Login { get; set; }

        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}
