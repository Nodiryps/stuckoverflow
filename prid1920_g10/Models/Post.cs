using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models {
    public class Post : IValidatableObject {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required(ErrorMessage = "Required")]
        public int Id { get; set; }
        // [Required(ErrorMessage = "Required")]
        public string Title { get; set; } // obligatoire pour les questions et doit être null pour les réponses.
        [Required(ErrorMessage = "Required")]
        public string Body { get; set; }
        [Required(ErrorMessage = "Required")]
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public int? ParentId { get; set; }
        public int AuthorId { get; set; }
        public int? AcceptedAnswerId { get; set; }
        public int Score {
            get {
                var s = 0;
                var query = from v in Votes
                            where v.PostId == this.Id
                                || v.PostId == this.ParentId
                            select v.UpDown;
                foreach (var updown in query)
                    s += updown;
                return s;
            }
        }

        [NotMapped]
        public IEnumerable<Tag> Tags {
            get => PostTags.Select(pt => pt.Tag);
        }
        public virtual User User { get; set; }
        public virtual IList<Post> Answers { get; set; } = new List<Post>();
        public virtual IList<Vote> Votes { get; set; } = new List<Vote>();
        public virtual IList<Comment> Comments { get; set; } = new List<Comment>();
        public virtual IList<PostTag> PostTags { get; set; } = new List<PostTag>();



        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            if (this.ParentId == null && this.Title == null)
                yield return new ValidationResult("Required", new[] { nameof(Title) });
        }

        private bool IsParent(Post p) {
            return p.Title == null;
        }
    }
}