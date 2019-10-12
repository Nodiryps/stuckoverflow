using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PRID_Framework
{
    public static class DbContextExtentions
    {
        public static ValidationErrors SaveChangesWithValidation(this DbContext context)
        {
            var result = context.ExecuteValidation();
            if (!result.IsEmpty) return result;
            context.SaveChanges();
            return result;
        }

        public static async Task<ValidationErrors> SaveChangesAsyncWithValidation(this DbContext context)
        {
            var result = context.ExecuteValidation();
            if (!result.IsEmpty) return result;
            await context.SaveChangesAsync();
            return result;
        }

        private static ValidationErrors ExecuteValidation(this DbContext context)
        {
            var result = new List<ValidationResult>();
            foreach (var entry in context.ChangeTracker.Entries().Where(
                e => (e.State == EntityState.Added) || (e.State == EntityState.Modified)).ToList())
            {
                var entity = entry.Entity;
                var valProvider = new ValidationDbContextServiceProvider(context);
                var valContext = new ValidationContext(entity, valProvider, null);
                var entityErrors = new List<ValidationResult>();
                if (!Validator.TryValidateObject(entity, valContext, entityErrors, true))
                {
                    result.AddRange(entityErrors);
                }
            }
            return result.ToValidationErrors();
        }

        private static ValidationErrors ToValidationErrors(this IList<ValidationResult> result)
        {
            var errors = new Dictionary<String, IList<String>>();
            foreach (var err in result)
            {
                foreach (var name in err.MemberNames)
                {
                    if (!errors.ContainsKey(name))
                        errors[name] = new List<String>();
                    errors[name].Add(err.ErrorMessage);
                }
            }
            return new ValidationErrors(errors);
        }
    }
}