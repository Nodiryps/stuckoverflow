using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models {
    public class Comment {
        [Key]
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime Timestamp { get; set; }
        public int AuthorId { get; set; }
        public int PostId { get; set; }
        
        public virtual Post Post { get; set; }
        public virtual User User { get; set; }
    }
}