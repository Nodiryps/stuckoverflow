using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace prid1920g10.Migrations
{
    public partial class newmodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Pseudo",
                table: "Users");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.AlterColumn<string>(
                name: "Pseudo",
                table: "Users",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Body = table.Column<string>(nullable: true),
                    Timestamp = table.Column<DateTime>(nullable: false),
                    AuthorId = table.Column<int>(nullable: false),
                    PostId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: true),
                    Timestamp = table.Column<DateTime>(nullable: false),
                    ParentId = table.Column<int>(nullable: false),
                    AuthorId = table.Column<int>(nullable: false),
                    AcceptedAnswerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PostTags",
                columns: table => new
                {
                    PostTagId = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PostId = table.Column<int>(nullable: false),
                    TagId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostTags", x => x.PostTagId);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Votes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UpDown = table.Column<int>(nullable: false),
                    AuthorId = table.Column<int>(nullable: false),
                    PostId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Votes", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "PostTags");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Votes");

            migrationBuilder.AlterColumn<string>(
                name: "Pseudo",
                table: "Users",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDate", "Email", "FirstName", "LastName", "Password", "Pseudo", "Reputation", "Role" },
                values: new object[] { 1, new DateTime(1990, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@epfc.eu", "Nimda", "Rotartsi", "epfc", "admin", 0, 2 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDate", "Email", "FirstName", "LastName", "Password", "Pseudo", "Reputation", "Role" },
                values: new object[] { 2, new DateTime(1983, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "yas@epfc.eu", "Yasmina", "El Ghouate", "epfc", "yas", 0, 0 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDate", "Email", "FirstName", "LastName", "Password", "Pseudo", "Reputation", "Role" },
                values: new object[] { 3, new DateTime(2000, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "oth@epfc.eu", "Othman", "Zamzam", "epfc", "oth", 0, 0 });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Pseudo",
                table: "Users",
                column: "Pseudo",
                unique: true);
        }
    }
}
