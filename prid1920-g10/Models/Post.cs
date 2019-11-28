using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models {
    public class Post {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp { get; set; }
        public int? ParentId { get; set; }
        public int AuthorId { get; set; }
        public int? AcceptedAnswerId { get; set; }

        public virtual User User { get; set; }
        public virtual IList<Post> Answers { get; set; } = new List<Post>();
        public virtual IList<Vote> Votes { get; set; } = new List<Vote>();
        public virtual IList<Comment> Comments { get; set; } = new List<Comment>();
        public virtual IList<PostTag> PostTags { get; set; } = new List<PostTag>();
        [NotMapped]
        public IEnumerable<Tag> Tags { get => PostTags.Select(p => p.Tag); }
        
    }
}