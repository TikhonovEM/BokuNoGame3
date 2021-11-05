using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Bng.SteamIntegrationService
{
    public class SteamIntegrationService : CronJobService
    {
        private readonly ILogger<SteamIntegrationService> _logger;

        public SteamIntegrationService(IScheduleConfig<SteamIntegrationService> config, ILogger<SteamIntegrationService> logger)
            : base(config.CronExpression, config.TimeZoneInfo)
        {
            _logger = logger;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("IntegrationService Started.");
            return base.StartAsync(cancellationToken);
        }

        public override Task DoWork(CancellationToken cancellationToken)
        {
            _logger.LogInformation($"{DateTime.Now:hh:mm:ss}.");
            return Task.CompletedTask;
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("IntegrationService Finished.");
            return base.StopAsync(cancellationToken);
        }
    }
}
