using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GesthumServer.Migrations
{
    /// <inheritdoc />
    public partial class fixResume : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Languages",
                table: "Resumes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProfileSummary",
                table: "Resumes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Languages",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "ProfileSummary",
                table: "Resumes");
        }
    }
}
