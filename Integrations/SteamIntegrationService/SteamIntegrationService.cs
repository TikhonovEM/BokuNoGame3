using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Steam.Models.SteamStore;
using SteamWebAPI2.Utilities;
using SteamWebAPI2.Interfaces;
using Bng.Shared.Models;
using System.Net.Http;
using Newtonsoft.Json;

namespace Bng.SteamIntegrationService
{
    public class SteamIntegrationService : CronJobService
    {
        private readonly ILogger<SteamIntegrationService> _logger;
        private readonly string _steamApiKey = Program.Configuration["IntegrationSettings:SteamWebApiKey"];
        private readonly string _maxPacketSize = Program.Configuration["IntegrationSettings:MaxPacketSize"];
        private readonly string _baseAddress = Program.Configuration["GamesAPI:BaseAddress"];
        private List<StoreAppDetailsDataModel> AppDetails = new();

        public SteamIntegrationService(IScheduleConfig<SteamIntegrationService> config, ILogger<SteamIntegrationService> logger)
            : base(config.CronExpression, config.TimeZoneInfo)
        {
            _logger = logger;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("SteamIntegrationService Started.");
            return base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("SteamIntegrationService Finished.");
            return base.StopAsync(cancellationToken);
        }

        public override async Task DoWork(CancellationToken cancellationToken)
        {
            await GetActualDataAsync();
            await SaveChangesAsync();
        }

        public async Task GetActualDataAsync()
        {
            _logger.LogInformation("Start integration session with Steam API");
            var appDetailsCollection = new List<StoreAppDetailsDataModel>();

            var steamWebInterfaceFactory = new SteamWebInterfaceFactory(_steamApiKey);
            var steamApps = steamWebInterfaceFactory.CreateSteamWebInterface<SteamApps>();

            using var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(_baseAddress);
            var response = await httpClient.GetStringAsync("IntegrationInfo/GetAllSystemIds/Steam");
            var ids = JsonConvert.DeserializeObject<List<int>>(response);

            var listResponse = await steamApps.GetAppListAsync();
            var appInfoList = listResponse.Data.Where(a => !ids.Any(id => id == a.AppId));

            var appsCount = 0;
            var isMaxSizeExists = false;
            if (_maxPacketSize != null)
            {
                try
                {
                    appsCount = Convert.ToInt32(_maxPacketSize);
                    isMaxSizeExists = true;
                }
                catch { }
            }
            var steamStoreInterface = steamWebInterfaceFactory.CreateSteamStoreInterface();
            var lang = "russian";
            foreach (var app in appInfoList)
            {
                StoreAppDetailsDataModel appDetails = null;
                try
                {
                    appDetails = await steamStoreInterface.GetStoreAppDetailsAsync(app.AppId, lang);
                }
                catch (NullReferenceException)
                {
                    _logger.LogError("Не удалось получить информацию о приложении {0}({1})", app.Name, app.AppId);
                    continue;
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Произошла непредвиденная ошибка: ");
                    continue;
                }
                // Skip DLC
                if (appDetails.Type.Equals("game"))
                {
                    AppDetails.Add(appDetails);
                    if (isMaxSizeExists && AppDetails.Count >= appsCount)
                        break;
                }
            }
        }

        public async Task SaveChangesAsync()
        {
            _logger.LogInformation("Start migration to DB");
            foreach (var appDetail in AppDetails)
            {
                try
                {
                    var game = new Game();
                    game.Name = appDetail.Name;
                    game.Description = appDetail.DetailedDescription;
                    game.Publisher = appDetail.Publishers.FirstOrDefault();
                    game.Developer = appDetail.Developers.FirstOrDefault();
                    var genres = appDetail.Genres;
                    var genreValue = Genre.Default;
                    foreach (var genre in genres)
                    {
                        // Поиск первого подходящего жанра.
                        genreValue = genre.Description switch
                        {
                            "Экшены" => Genre.Action,
                            "Симуляторы" => Genre.Simulation,
                            "Стратегии" => Genre.Strategy,
                            "Ролевые игры" => Genre.RPG,
                            "Головоломки" => Genre.Puzzle,
                            "Казуальные игры" => Genre.Arcade,
                            "Гонки" => Genre.Race,
                            _ => Genre.Default
                        };
                        if (genreValue != Genre.Default)
                            break;
                    }
                    game.Genre = genreValue;
                    game.ReleaseDate = Convert.ToDateTime(appDetail.ReleaseDate.Date);
                    game.AgeRating = appDetail.RequiredAge.ToString();
                    using var httpClient = new HttpClient();
                    game.Logo = await httpClient.GetByteArrayAsync(appDetail.HeaderImage);

                    httpClient.BaseAddress = new Uri(_baseAddress);
                    await httpClient.PostAsJsonAsync("Game", game);
                    _logger.LogInformation($"Created game(Id = {game.Name})");

                    var integrationInfo = new IntegrationInfo();
                    integrationInfo.ExternalSystemDescriptor = "Steam";
                    integrationInfo.ExternalGameId = Convert.ToInt32(appDetail.SteamAppId);
                    integrationInfo.InternalGameId = game.Id;
                    integrationInfo.Date = DateTime.Now;
                    await httpClient.PostAsJsonAsync("IntegrationInfo", integrationInfo);
                    _logger.LogInformation($"Created integration info(Id = {integrationInfo.InternalGameId})");
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Произошла ошибка при миграции в БД");
                }
            }
        }
    }
}
