using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models {
    public class Post : IValidatableObject {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { get; set; } // obligatoire pour les questions et doit être nul pour les réponses.
        [Required]
        public string Body { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public int? ParentId { get; set; }
        public int AuthorId { get; set; }
        public int? AcceptedAnswerId { get; set; }
        public int Score { 
            get  {
                var s = 0;
                var query = from v in Votes 
                            where v.PostId == this.Id 
                                || v.PostId == this.ParentId
                            select v.UpDown;
                foreach(var updown in query)
                    s += updown;
                return s;
            }
        }
        // public IList<Post> WithTags { 
        //     get  {
                
        //     }
        // }

        [NotMapped]
        public IEnumerable<Tag> Tags { 
            get => PostTags.Select(pt => pt.Tag); 
            // set => PostTags.Where(pt => pt.PostId == Id); 
            // set => PostTags.Select(pt => pt.Tag); 
        }
        public virtual User User { get; set; }
        public virtual IList<Post> Answers { get; set; } = new List<Post>();
        public virtual IList<Vote> Votes { get; set; } = new List<Vote>();
        public virtual IList<Comment> Comments { get; set; } = new List<Comment>();
        public virtual IList<PostTag> PostTags { get; set; } = new List<PostTag>();
        


        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) {
            yield return new ValidationResult("");
        }

        private bool IsParent(Post p){
            return p.Title == null;
        }
    }
}