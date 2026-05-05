using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interview_Question_Generator.Migrations
{
    /// <inheritdoc />
    public partial class AddAiMcqJsonSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "TestSessions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserAnswersJson",
                table: "TestSessions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAiGenerated",
                table: "QuestionRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SourceContent",
                table: "QuestionRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceType",
                table: "QuestionRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceUrl",
                table: "QuestionRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CorrectAnswer",
                table: "GeneratedQuestions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OptionsJson",
                table: "GeneratedQuestions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Score",
                table: "TestSessions");

            migrationBuilder.DropColumn(
                name: "UserAnswersJson",
                table: "TestSessions");

            migrationBuilder.DropColumn(
                name: "IsAiGenerated",
                table: "QuestionRequests");

            migrationBuilder.DropColumn(
                name: "SourceContent",
                table: "QuestionRequests");

            migrationBuilder.DropColumn(
                name: "SourceType",
                table: "QuestionRequests");

            migrationBuilder.DropColumn(
                name: "SourceUrl",
                table: "QuestionRequests");

            migrationBuilder.DropColumn(
                name: "CorrectAnswer",
                table: "GeneratedQuestions");

            migrationBuilder.DropColumn(
                name: "OptionsJson",
                table: "GeneratedQuestions");
        }
    }
}
