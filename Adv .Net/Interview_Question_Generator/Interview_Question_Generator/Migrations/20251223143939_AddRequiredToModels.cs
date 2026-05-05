using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interview_Question_Generator.Migrations
{
    /// <inheritdoc />
    public partial class AddRequiredToModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Generated__Categ__6FE99F9F",
                table: "GeneratedQuestions");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "GeneratedQuestions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "Feedback",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK__Generated__Categ__6FE99F9F",
                table: "GeneratedQuestions",
                column: "CategoryId",
                principalTable: "QuestionCategories",
                principalColumn: "CategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Generated__Categ__6FE99F9F",
                table: "GeneratedQuestions");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "GeneratedQuestions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Rating",
                table: "Feedback",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK__Generated__Categ__6FE99F9F",
                table: "GeneratedQuestions",
                column: "CategoryId",
                principalTable: "QuestionCategories",
                principalColumn: "CategoryId");
        }
    }
}
