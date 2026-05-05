using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interview_Question_Generator.Migrations
{
    /// <inheritdoc />
    public partial class MakeRequestIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UploadedMcqFiles_Users_UploadedUserUserId",
                table: "UploadedMcqFiles");

            migrationBuilder.DropIndex(
                name: "IX_UploadedMcqFiles_UploadedUserUserId",
                table: "UploadedMcqFiles");

            migrationBuilder.AlterColumn<int>(
                name: "RequestId",
                table: "GeneratedQuestions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RequestId",
                table: "GeneratedQuestions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UploadedMcqFiles_UploadedUserUserId",
                table: "UploadedMcqFiles",
                column: "UploadedUserUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UploadedMcqFiles_Users_UploadedUserUserId",
                table: "UploadedMcqFiles",
                column: "UploadedUserUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
