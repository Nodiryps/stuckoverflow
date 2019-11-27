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
    }
}