using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.AccountsAPI.Models
{
    public class AuthenticateResponse
    {
        public string Id { get; set; }
        public string Nickname { get; set; }
        public string Username { get; set; }
        public string Roles { get; set; }
        public string JwtToken { get; set; }
        [JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }

        public AuthenticateResponse(User user, string jwtToken, string refreshToken, string roles)
        {
            Id = user.Id;
            Username = user.UserName;
            Nickname = user.Nickname;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
            Roles = roles;
        }
    }
}
