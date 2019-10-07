using System;
using Microsoft.EntityFrameworkCore;

namespace prid1920_g10.Models
{
    public class G10Context : DbContext
    {
        public G10Context(DbContextOptions<G10Context> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>()
                .Property(f => f.Id)
                .ValueGeneratedOnAdd(); // auto-increment id
            builder.Entity<User>()
                .HasIndex(u => u.Pseudo)
                .IsUnique(); //unicity pseudo
            builder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique(); //unicity email

            // if (builder.Entity<User>().Property(u => u.FirstName != ""))
            // {
            //     builder.Entity<User>().Property(b => b.FirstName).IsRequired();
            //     builder.Entity<User>().Property(b => b.LastName).IsRequired();
            // }

            // if (builder.Entity<User>().Property(u => u.LastName != ""))
            // {
            //     builder.Entity<User>().Property(b => b.FirstName).IsRequired();
            //     builder.Entity<User>().Property(b => b.LastName).IsRequired();
            // }
        }
    }
}