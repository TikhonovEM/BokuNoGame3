using Bng.Shared.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.GamesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntegrationInfoController : BaseCRUDController<IntegrationInfoController, IntegrationInfo>
    {
        [HttpGet("GetAllSystemIds/{descriptor}")]
        public object GetAllSystemIds(string descriptor)
        {
            var infos = Context.IntegrationInfos
                .Where(ii => ii.ExternalSystemDescriptor.Equals(descriptor));
            if (infos.Any(ii => !string.IsNullOrWhiteSpace(ii.ExternalGameIdStr)))
                return infos.Select(ii => ii.ExternalGameIdStr).ToList();
            else
                return infos.Select(ii => ii.ExternalGameId).ToList();
        }
    }
}
