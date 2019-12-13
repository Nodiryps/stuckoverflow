using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace prid1920g10.Migrations
{
    public partial class role : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Users",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BirthDate", "Email", "FirstName", "LastName", "Pseudo", "Role" },
                values: new object[] { new DateTime(1990, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@epfc.eu", "Nimda", "Rotartsi", "admin", 2 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BirthDate", "Email", "FirstName", "LastName", "Pseudo" },
                values: new object[] { new DateTime(1983, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "yas@epfc.eu", "Yasmina", "El Ghouate", "yas" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDate", "Email", "FirstName", "LastName", "Password", "Pseudo", "Reputation", "Role" },
                values: new object[] { 3, new DateTime(2000, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "oth@epfc.eu", "Othman", "Zamzam", "epfc", "oth", 0, 0 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BirthDate", "Email", "FirstName", "LastName", "Pseudo" },
                values: new object[] { new DateTime(1983, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "yas@epfc.eu", "Yasmina", "El Ghouate", "yas" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BirthDate", "Email", "FirstName", "LastName", "Pseudo" },
                values: new object[] { new DateTime(2000, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "oth@epfc.eu", "Othman", "Zamzam", "oth" });
        }
    }
}
