using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Bng.AccountsAPI.Helpers
{
    public class UserLibraryScheme : IUserLibraryService
    {

        public object GetLibraryScheme<TLibraryModel>(string format)
        {
            var scheme = format.ToUpper() switch
            {
                "REACT_TABLES" => GetReactTableScheme<TLibraryModel>(),
                _ => throw new ArgumentException($"Unknown library format '{format}'")
            };

            return scheme;
        }

        private static object GetReactTableScheme<TLibraryModel>()
        {
            var type = typeof(TLibraryModel);
            var props = type.GetProperties().Where(p => p.PropertyType.IsValueType || Equals(p.PropertyType, typeof(string)));

            // Сразу сериализуем объект, что сохранить кейс названий свойства (в react-tables именно в таком регистре параметры).
            return JsonConvert.SerializeObject(props.Where(p => p.GetCustomAttribute<DisplayAttribute>() != null).Select(p => new
            {
                Header = p.GetCustomAttribute<DisplayAttribute>().Name ?? p.Name,
                accessor = char.ToLowerInvariant(p.Name[0]) + p.Name[1..]
            }).ToArray());
        }
    }
}
