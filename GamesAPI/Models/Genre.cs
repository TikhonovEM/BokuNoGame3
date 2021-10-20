using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GamesAPI.Models
{
    public enum Genre
    {
        [Display(Name = "Любой")]
        Default,
        [Display(Name = "Экшен")]
        Action,
        [Display(Name = "Симулятор")]
        Simulation,
        [Display(Name = "Стратегия")]
        Strategy,
        [Display(Name = "РПГ")]
        RPG,
        [Display(Name = "Головоломка")]
        Puzzle,
        [Display(Name = "Аркада")]
        Arcade,
        [Display(Name = "Гонки")]
        Race
    }
}
