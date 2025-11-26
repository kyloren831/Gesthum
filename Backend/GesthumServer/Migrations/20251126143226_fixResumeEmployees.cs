using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GesthumServer.Migrations
{
    /// <inheritdoc />
    public partial class fixResumeEmployees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Resumes_EmployeeId",
                table: "Resumes");

            migrationBuilder.CreateIndex(
                name: "IX_Resumes_EmployeeId",
                table: "Resumes",
                column: "EmployeeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Resumes_EmployeeId",
                table: "Resumes");

            migrationBuilder.CreateIndex(
                name: "IX_Resumes_EmployeeId",
                table: "Resumes",
                column: "EmployeeId",
                unique: true);
        }
    }
}
