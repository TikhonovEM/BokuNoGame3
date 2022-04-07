using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Bng.Shared.Extensions;

namespace Bng.Shared.Models
{
    public class GameSummary : IEntity
    {
        public int Id { get; set; }
        [Display(Name = "Название")]
        public string GameName { get; set; }
        [Display(Name = "Ваша оценка")]
        public int? Rate { get; set; }       
        public Genre Genre { get; set; }
        [Display(Name = "Жанр")]
        public string GenreWrapper { get => Genre.GetAttribute<DisplayAttribute>().Name; }
        public int GameId { get; set; }
        public Game Game { get; set; }
        public string UserId { get; set; }
        public Catalog Catalog { get; set; }
        public int CatalogId { get; set; }
    }
}