using Newtonsoft.Json;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.ComponentModel.DataAnnotations;

namespace PRID_Framework
{
    public class ValidationErrors
    {
        public ValidationErrors() { }
        public ValidationErrors(IDictionary<string, IList<string>> errors)
        {
            Errors = errors;
        }

        public ValidationErrors Add(string error, params string[] properties)
        {
            foreach (var prop in properties)
            {
                if (!Errors.ContainsKey(prop))
                    Errors[prop] = new List<string>();
                Errors[prop].Add(error);
            }
            return this;
        }

        public IDictionary<string, IList<string>> Errors { get; } = new Dictionary<string, IList<string>>();
        
        [JsonIgnore]
        public bool IsEmpty { get => Errors.Count == 0; }
    }
}