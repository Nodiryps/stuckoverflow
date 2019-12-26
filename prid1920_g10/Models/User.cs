using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models {
    public enum Role { Admin = 2, Member = 1, Visitor = 0 }

    public class User : IValidatableObject {
        private const int MinLengthPseudoPasswordName = 3;
        private const int MaxLengthPseudo = 10;
        private const int MaxLengthName = 30;

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required(ErrorMessage = "Required")]
        public string Pseudo { get; set; }
        [Required(ErrorMessage = "Required")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Required")]
        public int Reputation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public Role Role { get; set; } = Role.Member;
        [NotMapped]
        public string Token { get; set; }

        public virtual IList<Post> Posts { get; set; } = new List<Post>();
        public virtual IList<Comment> Comments { get; set; } = new List<Comment>();
        public virtual IList<Vote> Votes { get; set; } = new List<Vote>();
        public int? Age {
            get {
                if (!BirthDate.HasValue)
                    return null;
                var today = DateTime.Today;
                var age = today.Year - BirthDate.Value.Year;
                if (BirthDate.Value.Date > today.AddYears(-age)) age--;
                return age;
            }
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            var currContext = validationContext.GetService(typeof(DbContext)) as G10Context;
            Debug.Assert(currContext != null);

            PseudoValidations(currContext);
            NameValidations();
            EmailValidations();
            BirthDateValidations();
            yield return new ValidationResult("");
        }

        IEnumerable<ValidationResult> BirthDateValidations() {
            if (BirthDate.HasValue && BirthDate.Value.Date > DateTime.Today)
                yield return new ValidationResult("Can't be born in the future in this reality", new[] { nameof(BirthDate) });
            if (Age.HasValue && Age < 18)
                yield return new ValidationResult("Must be 18 years old", new[] { nameof(BirthDate) });
        }

        IEnumerable<ValidationResult> EmailValidations() {
            string emailPattern = "^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$";
            bool isEmailValid = Regex.IsMatch(Email, emailPattern);

            if (!isEmailValid)
                yield return new ValidationResult("Invalid email", new[] { nameof(Email) });
        }

        IEnumerable<ValidationResult> NameValidations() {
            string namePattern = "^[A-Za-z]+$";
            bool isFirstNameValid = Regex.IsMatch(FirstName, namePattern);
            bool isLastNameValid = Regex.IsMatch(LastName, namePattern);

            if (!isFirstNameValid)
                yield return new ValidationResult("Invalid firstname (only letters)", new[] { nameof(FirstName) });
            if (!isLastNameValid)
                yield return new ValidationResult("Invalid lastname (only letters)", new[] { nameof(LastName) });
            if (!IsFirstNameLengthValid())
                yield return new ValidationResult("Invalid firstname (" + MinLengthPseudoPasswordName + "-" + MaxLengthName + " char)", new[] { nameof(FirstName) });
            if (!IsLastNameLengthValid())
                yield return new ValidationResult("Invalid lastname (" + MinLengthPseudoPasswordName + "-" + MaxLengthName + " char)", new[] { nameof(LastName) });
        }

        IEnumerable<ValidationResult> PseudoValidations(G10Context c) {
            string pseudoPattern = "^[\\W\\d_]+$";
            bool isPseudoValid = Regex.IsMatch(Pseudo, pseudoPattern);

            if (!IsPseudoUnique(Pseudo, c))
                yield return new ValidationResult("Pseudo already exists", new[] { nameof(Pseudo) });
            if (!isPseudoValid)
                yield return new ValidationResult("Invalid pseudo: letters/numbers/underscores allowed (Should begin by a letter)", new[] { nameof(Pseudo) });
            if (!IsPseudoLengthValid())
                yield return new ValidationResult("Invalid pseudo (" + MinLengthPseudoPasswordName + " - " + MaxLengthPseudo + " char)", new[] { nameof(Pseudo) });
            if (!IsPasswordLengthValid())
                yield return new ValidationResult("Invalid password (min " + MinLengthPseudoPasswordName + " char)", new[] { nameof(Password) });
        }

        static bool IsPseudoUnique(string pseudo, G10Context c) {
            return (from u in c.Users
                    where u.Pseudo == pseudo
                    select u).FirstOrDefault() == null;
        }

        bool IsPasswordLengthValid() {
            return Password.Length >= MinLengthPseudoPasswordName;
        }

        bool IsLastNameLengthValid() {
            return LastName.Length >= MinLengthPseudoPasswordName && LastName.Length <= MaxLengthName;
        }

        bool IsFirstNameLengthValid() {
            return FirstName.Length >= MinLengthPseudoPasswordName && FirstName.Length <= MaxLengthName;
        }

        bool IsPseudoLengthValid() {
            return Pseudo.Length >= MinLengthPseudoPasswordName && Pseudo.Length <= MaxLengthPseudo;
        }
    }
}