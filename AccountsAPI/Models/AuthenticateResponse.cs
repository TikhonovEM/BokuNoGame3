using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
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

        public byte[] Photo { get; set; }

        //TODO Раскомментировать после фикса проблемы с отправкой кук запросом с клиента.
        //[JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }

        public AuthenticateResponse(User user, string jwtToken, string refreshToken, string roles)
        {
            Id = user.Id;
            Username = user.UserName;
            Nickname = user.Nickname;
            Photo = user.Photo;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
            Roles = roles;
        }
    }
}
