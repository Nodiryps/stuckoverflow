using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid1920_g10.Models
{
    public class User : IValidatableObject
    {
        private const int PasswordAndPseudoMinLength = 3;
        private const int PasswordAndPseudoMaxLength = 10;
        private const int NameMinLength = 3;
        private const int NameMaxLength = 50;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(PasswordAndPseudoMinLength, ErrorMessage = "Minimum 3 characters")]
        [MaxLength(PasswordAndPseudoMaxLength, ErrorMessage = "Maximum 10 characters")]
        public string Pseudo { get; set; }

        [Required(ErrorMessage = "Required")]
        [MinLength(PasswordAndPseudoMinLength, ErrorMessage = "Minimum 3 characters")]
        [MaxLength(PasswordAndPseudoMaxLength, ErrorMessage = "Maximum 10 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Required")]
        public string Email { get; set; }

        [MinLength(NameMinLength, ErrorMessage = "Minimum 3 characters")]
        [MaxLength(NameMaxLength, ErrorMessage = "Maximum 50 characters")]
        public string FirstName { get; set; }

        [MinLength(NameMinLength, ErrorMessage = "Minimum 3 characters")]
        [MaxLength(NameMaxLength, ErrorMessage = "Maximum 50 characters")]
        public string LastName { get; set; }

        public DateTime? BirthDate { get; set; }

        public int? Age
        {
            get
            {
                if (!BirthDate.HasValue)
                    return null;
                var today = DateTime.Today;
                var age = today.Year - BirthDate.Value.Year;
                if (BirthDate.Value.Date > today.AddYears(-age)) age--;
                return age;
            }
        }

        [Required(ErrorMessage = "Required")]
        public int Reputation { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var currContext = validationContext.GetService(typeof(DbContext));
            Debug.Assert(currContext != null);

            string pseudoPattern = "^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$";
            string emailPattern = @"^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$";
            bool isPseudoValid = Regex.IsMatch(Pseudo, pseudoPattern);
            bool isEmailValid = Regex.IsMatch(Email, emailPattern);

            if (!isPseudoValid)
                yield return new ValidationResult("Invalid pseudo", new[] { nameof(Pseudo) });
            if (!isEmailValid)
                yield return new ValidationResult("Invalid email", new[] { nameof(Email) });
            if (Password == "abc")
                yield return new ValidationResult("The password may not be equal to 'abc'", new[] { nameof(Password) });
            if (BirthDate.HasValue && BirthDate.Value.Date > DateTime.Today)
                yield return new ValidationResult("Can't be born in the future in this reality", new[] { nameof(BirthDate) });
            if (Reputation < 0)
                yield return new ValidationResult("Reputation < 0", new[] { nameof(Reputation) });
            if (Age.HasValue && Age < 18)
                yield return new ValidationResult("Must be 18 years old", new[] { nameof(BirthDate) });
        }
    }
}