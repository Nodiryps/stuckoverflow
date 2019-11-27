using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models {
    public class Tag {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual List<Post> Posts { get; set; }
    }
}