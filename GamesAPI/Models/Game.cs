using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.GamesAPI.Models
{
    public class Game
    {
        public int Id { get; set; }
        [Display(Name = "Название игры")]
        public string Name { get; set; }
        [Display(Name = "Описание")]
        public string Description { get; set; }
        [Display(Name = "Путь до лого игры")]
        public byte[] Logo { get; set; }
        [Display(Name = "Жанр")]
        public Genre Genre { get; set; }
        [Display(Name = "Рейтинг")]
        public double Rating { get; set; }
        [Display(Name = "Издатель")]
        public string Publisher { get; set; }
        [Display(Name = "Разработчик")]
        public string Developer { get; set; }
        [Display(Name = "Дата выхода"), DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }
        [Display(Name = "Возрастной рейтинг")]
        public string AgeRating { get; set; }

    }
}
