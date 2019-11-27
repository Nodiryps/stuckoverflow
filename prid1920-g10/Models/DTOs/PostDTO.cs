using System;

namespace prid1920_g10.Models
{
    public class PostDTO {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp { get; set; }
        public virtual int ParentId { get; set; }
        public virtual int AuthorId { get; set; }
        public virtual int AcceptedAnswerId { get; set; }
    }
}