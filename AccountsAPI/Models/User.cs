using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Bng.AccountsAPI.Models
{
    public class User : IdentityUser
    {
        public string Nickname { get; set; }
        public string FullName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime RegistrationDate { get; set; }
        public byte[] Photo { get; set; }
        [JsonIgnore]
        public List<RefreshToken> RefreshTokens { get; set; }

        public User()
        {
            RegistrationDate = DateTime.Now;
        }
    }
}
