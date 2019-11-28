using System;

namespace prid1920_g10.Models {
    public class CommentDTO {
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp { get; set; }
        public int AuthorId { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public User User { get; set; }
    }
}