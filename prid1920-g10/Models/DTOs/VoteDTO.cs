using System;

namespace prid1920_g10.Models
{
    public class VoteDTO
    {
        public int UpDown { get; set; }
        public virtual int AuthorId { get; set; }
        public virtual int PostId { get; set; }
    }
}