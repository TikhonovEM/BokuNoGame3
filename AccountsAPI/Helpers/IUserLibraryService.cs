using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.AccountsAPI.Helpers
{
    public interface IUserLibraryService
    {
        object GetLibraryScheme<TLibraryModel>(string format);
    }
}
