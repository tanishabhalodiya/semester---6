using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interview_Question_Generator.Migrations
{
    /// <inheritdoc />
    public partial class AddUserImageUrlAndBulkUploadTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UploadedMcqFiles",
                columns: table => new
                {
                    FileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileContent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UploadedBy = table.Column<int>(type: "int", nullable: false),
                    UploadedUserUserId = table.Column<int>(type: "int", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UploadedMcqFiles", x => x.FileId);
                    table.ForeignKey(
                        name: "FK_UploadedMcqFiles_Users_UploadedUserUserId",
                        column: x => x.UploadedUserUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UploadedMcqFiles_UploadedUserUserId",
                table: "UploadedMcqFiles",
                column: "UploadedUserUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UploadedMcqFiles");

            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "Users");
        }
    }
}
