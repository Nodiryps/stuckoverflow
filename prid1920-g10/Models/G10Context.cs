using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using prid1920_g10.Models;
using prid1920_g10.Helpers;
using PRID_Framework;

namespace prid1920_g10.Models
{
    public class G10Context : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Vote> Votes { get; set; }

        public G10Context(DbContextOptions<G10Context> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // base.OnModelCreating(builder);

            // builder.Entity<User>()
            //     .Property(f => f.Id)
            //     .ValueGeneratedOnAdd(); 
            // builder.Entity<User>()
            //     .HasIndex(u => u.Pseudo)
            //     .IsUnique(); //unicity pseudo
            // builder.Entity<User>()
            //     .HasIndex(u => u.Email)
            //     .IsUnique(); //unicity email
        }
    }
}