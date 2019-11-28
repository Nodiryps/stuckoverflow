using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models
{
    public class PostDTO {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp { get; set; }
        public int? ParentId { get; set; }
        public int AuthorId { get; set; }
        public int? AcceptedAnswerId { get; set; }
        public IList<Post> Answers { get; set; } = new List<Post>();
        public IList<Vote> Votes { get; set; } = new List<Vote>();
        public IList<Comment> Comments { get; set; } = new List<Comment>();
        public IList<PostTag> PostTags { get; set; } = new List<PostTag>();
        [NotMapped]
        public IEnumerable<Tag> Tags { get => PostTags.Select(p => p.Tag); }
    }
}