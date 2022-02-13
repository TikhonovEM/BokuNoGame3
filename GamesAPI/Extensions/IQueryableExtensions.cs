using Bng.GamesAPI.Domain;
using Bng.Shared.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bng.GamesAPI.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<Game> ApplyFilter(this IQueryable<Game> query, FilterState filterState)
        {
            if (filterState == null)
                return query;

            query = query.AsNoTracking();            

            if (!string.IsNullOrEmpty(filterState.Name))
                query = query.Where(g => g.Name.Contains(filterState.Name));

            if (filterState.Genre != Genre.Default)
                query = query.Where(g => g.Genre == filterState.Genre);

            if (filterState.Rating.HasValue)
                query.Where(g => g.Rating >= filterState.Rating);

            if (!string.IsNullOrEmpty(filterState.Publisher))
                query = query.Where(g => g.Publisher.Equals(filterState.Publisher));

            if (!string.IsNullOrEmpty(filterState.Developer))
                query = query.Where(g => g.Developer.Equals(filterState.Developer));

            if (filterState.ReleaseYearStart.HasValue && filterState.ReleaseYearEnd.HasValue)
                query = query.Where(g => g.ReleaseDate.Year >= filterState.ReleaseYearStart && g.ReleaseDate.Year <= filterState.ReleaseYearEnd);

            else if (filterState.ReleaseYearStart.HasValue && !filterState.ReleaseYearEnd.HasValue)
                query = query.Where(g => g.ReleaseDate.Year >= filterState.ReleaseYearStart);

            else if (!filterState.ReleaseYearStart.HasValue && filterState.ReleaseYearEnd.HasValue)
                query = query.Where(g => g.ReleaseDate.Year <= filterState.ReleaseYearEnd);

            if (filterState.Rating.HasValue)
                query = query.Where(g => g.Rating >= filterState.Rating);

            if (!string.IsNullOrEmpty(filterState.AgeRating))
                query = query.Where(g => g.AgeRating.Equals(filterState.AgeRating));

            return query;
        }

        public static IQueryable<Game> TruncateToPage(this IQueryable<Game> query, Page page)
        {
            return query
                .Skip((page.PageNumber - 1) * Page.PageSize)
                .Take(Page.PageSize);
        }
    }
}
