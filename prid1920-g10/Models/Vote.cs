using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace prid1920_g10.Models {
    public class Vote {
        public int UpDown { get; set; }
        public virtual int AuthorId { get; set; }
        public int Id { get; set; }
        public virtual int PostId { get; set; }
        public virtual User User { get; set; }
        public virtual Post Post { get; set; }
    }
}