using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GesthumServer.Migrations
{
    /// <inheritdoc />
    public partial class fixWorkExp_Cascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkExperience_Resumes_ResumeId",
                table: "WorkExperience");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkExperience",
                table: "WorkExperience");

            migrationBuilder.RenameTable(
                name: "WorkExperience",
                newName: "WorkExperiences");

            migrationBuilder.RenameIndex(
                name: "IX_WorkExperience_ResumeId",
                table: "WorkExperiences",
                newName: "IX_WorkExperiences_ResumeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkExperiences",
                table: "WorkExperiences",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkExperiences_Resumes_ResumeId",
                table: "WorkExperiences",
                column: "ResumeId",
                principalTable: "Resumes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkExperiences_Resumes_ResumeId",
                table: "WorkExperiences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkExperiences",
                table: "WorkExperiences");

            migrationBuilder.RenameTable(
                name: "WorkExperiences",
                newName: "WorkExperience");

            migrationBuilder.RenameIndex(
                name: "IX_WorkExperiences_ResumeId",
                table: "WorkExperience",
                newName: "IX_WorkExperience_ResumeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkExperience",
                table: "WorkExperience",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkExperience_Resumes_ResumeId",
                table: "WorkExperience",
                column: "ResumeId",
                principalTable: "Resumes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
