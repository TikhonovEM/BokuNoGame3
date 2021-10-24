using GamesAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntegrationInfoController : BaseCRUDController<IntegrationInfoController, IntegrationInfo>
    {
        [HttpGet("GetAllSystemIds/{descriptor}")]
        public object GetAllSystemIds(string descriptor)
        {
            var ids = Context.IntegrationInfos
                .Where(ii => ii.ExternalSystemDescriptor.Equals(descriptor))
                .Select(ii => ii.ExternalGameId);
            return ids.ToList();
        }
    }
}
