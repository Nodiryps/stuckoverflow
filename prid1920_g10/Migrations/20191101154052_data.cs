using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace prid1920g10.Migrations
{
    public partial class data : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDate", "Email", "FirstName", "LastName", "Password", "Pseudo", "Reputation" },
                values: new object[] { 1, new DateTime(1983, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "yas@epfc.eu", "Yasmina", "El Ghouate", "epfc", "yas", 0 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDate", "Email", "FirstName", "LastName", "Password", "Pseudo", "Reputation" },
                values: new object[] { 2, new DateTime(2000, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), "oth@epfc.eu", "Othman", "Zamzam", "epfc", "oth", 0 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
