using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models {
    public class Vote : IValidatableObject {
        [Required(ErrorMessage = "Required")]
        public int UpDown { get; set; }
        public int AuthorId { get; set; }
        public int PostId { get; set; }

        public virtual User User { get; set; }
        public virtual Post Post { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            if (Math.Abs(this.UpDown) != 1)
                yield return new ValidationResult("Value must be 1 OR -1", new[] { nameof(UpDown) });
        }
    }
}