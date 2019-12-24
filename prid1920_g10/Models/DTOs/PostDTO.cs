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
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public int? ParentId { get; set; }
        public int AuthorId { get; set; }
        public int? AcceptedAnswerId { get; set; }
        public IList<PostDTO> Answers { get; set; } 
        public IList<VoteDTO> Votes { get; set; }
        public IList<CommentDTO> Comments { get; set; } 
        public IList<PostTag> PostTags { get; set; } 
        public IEnumerable<Tag> Tags { get; set; }
    }
}