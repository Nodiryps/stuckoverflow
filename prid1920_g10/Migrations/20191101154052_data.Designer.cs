// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using prid1920_g10.Models;

namespace prid1920g10.Migrations
{
    [DbContext(typeof(G10Context))]
    [Migration("20191101154052_data")]
    partial class data
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("prid1920_g10.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("BirthDate");

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<string>("Password")
                        .IsRequired();

                    b.Property<string>("Pseudo")
                        .IsRequired();

                    b.Property<int>("Reputation");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Pseudo")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            BirthDate = new DateTime(1983, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "yas@epfc.eu",
                            FirstName = "Yasmina",
                            LastName = "El Ghouate",
                            Password = "epfc",
                            Pseudo = "yas",
                            Reputation = 0
                        },
                        new
                        {
                            Id = 2,
                            BirthDate = new DateTime(2000, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "oth@epfc.eu",
                            FirstName = "Othman",
                            LastName = "Zamzam",
                            Password = "epfc",
                            Pseudo = "oth",
                            Reputation = 0
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
