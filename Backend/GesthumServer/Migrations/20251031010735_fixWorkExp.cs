using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GesthumServer.Migrations
{
    /// <inheritdoc />
    public partial class fixWorkExp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Resumes_EmployeeId",
                table: "Resumes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "WorkExperience",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateIndex(
                name: "IX_Resumes_EmployeeId",
                table: "Resumes",
                column: "EmployeeId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Resumes_EmployeeId",
                table: "Resumes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "WorkExperience",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Resumes_EmployeeId",
                table: "Resumes",
                column: "EmployeeId");
        }
    }
}
