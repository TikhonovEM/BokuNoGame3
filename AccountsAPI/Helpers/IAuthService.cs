using Bng.AccountsAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.AccountsAPI.Helpers
{
    public interface IAuthService
    {
        Task<AuthenticateResponse> Authenticate(Credentials credentials, string ipAddress);
        Task<AuthenticateResponse> RefreshToken(string token, string ipAddress);
        bool RevokeToken(string token, string ipAddress);
    }
}
