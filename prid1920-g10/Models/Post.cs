using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models
{
    public class Post {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp { get; set; }
        public virtual int ParentId { get; set; }
        public virtual int AuthorId { get; set; }
        public virtual int AcceptedAnswerId { get; set; }
        public virtual IList<Comment> Comments {get; set;} = new List<Comment>();
        [NotMapped]
        public virtual IList<Tag> Tags {get; set;}=new List<Tag>();
        public virtual IList<Vote> Votes {get; set;}=new List<Vote>();
        public virtual User User {get; set;}
    }
}