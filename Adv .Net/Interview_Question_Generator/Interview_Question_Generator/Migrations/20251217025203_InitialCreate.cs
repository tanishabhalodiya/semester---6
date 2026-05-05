using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interview_Question_Generator.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuestionCategories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Question__19093A0BCB86AF20", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Roles__8AFACE1A22A60E9E", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Skills",
                columns: table => new
                {
                    SkillId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SkillName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Skills__DFA09187FC76A23E", x => x.SkillId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__1788CC4C292A1E45", x => x.UserId);
                    table.ForeignKey(
                        name: "FK__Users__RoleId__60A75C0F",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId");
                });

            migrationBuilder.CreateTable(
                name: "AIRequestLogs",
                columns: table => new
                {
                    LogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RequestTime = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AIReques__5E5486481B8466AD", x => x.LogId);
                    table.ForeignKey(
                        name: "FK__AIRequest__UserI__01142BA1",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "QuestionRequests",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SkillId = table.Column<int>(type: "int", nullable: false),
                    Difficulty = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Experience = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    RequestedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Question__33A8517AF4449BE9", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK__QuestionR__Skill__6B24EA82",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "SkillId");
                    table.ForeignKey(
                        name: "FK__QuestionR__UserI__6A30C649",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "TestSessions",
                columns: table => new
                {
                    SessionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SkillId = table.Column<int>(type: "int", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    CompletedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TestSess__C9F49290322990AE", x => x.SessionId);
                    table.ForeignKey(
                        name: "FK__TestSessi__Skill__7D439ABD",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "SkillId");
                    table.ForeignKey(
                        name: "FK__TestSessi__UserI__7C4F7684",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "GeneratedQuestions",
                columns: table => new
                {
                    QuestionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: true),
                    QuestionText = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Generate__0DC06FACAD492331", x => x.QuestionId);
                    table.ForeignKey(
                        name: "FK__Generated__Categ__6FE99F9F",
                        column: x => x.CategoryId,
                        principalTable: "QuestionCategories",
                        principalColumn: "CategoryId");
                    table.ForeignKey(
                        name: "FK__Generated__Reque__6EF57B66",
                        column: x => x.RequestId,
                        principalTable: "QuestionRequests",
                        principalColumn: "RequestId");
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    FeedbackId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    Comment = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Feedback__6A4BEDD66B75B9EF", x => x.FeedbackId);
                    table.ForeignKey(
                        name: "FK__Feedback__Questi__787EE5A0",
                        column: x => x.QuestionId,
                        principalTable: "GeneratedQuestions",
                        principalColumn: "QuestionId");
                    table.ForeignKey(
                        name: "FK__Feedback__UserId__778AC167",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "UserSavedQuestions",
                columns: table => new
                {
                    SaveId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__UserSave__1450D3A66C314662", x => x.SaveId);
                    table.ForeignKey(
                        name: "FK__UserSaved__Quest__73BA3083",
                        column: x => x.QuestionId,
                        principalTable: "GeneratedQuestions",
                        principalColumn: "QuestionId");
                    table.ForeignKey(
                        name: "FK__UserSaved__UserI__72C60C4A",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AIRequestLogs_UserId",
                table: "AIRequestLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_QuestionId",
                table: "Feedback",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_UserId",
                table: "Feedback",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedQuestions_CategoryId",
                table: "GeneratedQuestions",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedQuestions_RequestId",
                table: "GeneratedQuestions",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "UQ__Question__8517B2E065A05B45",
                table: "QuestionCategories",
                column: "CategoryName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionRequests_SkillId",
                table: "QuestionRequests",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionRequests_UserId",
                table: "QuestionRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "UQ__Roles__8A2B6160F3734CCD",
                table: "Roles",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Skills__B63C65710FB4FE2F",
                table: "Skills",
                column: "SkillName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestSessions_SkillId",
                table: "TestSessions",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_TestSessions_UserId",
                table: "TestSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__A9D105348B63627A",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSavedQuestions_QuestionId",
                table: "UserSavedQuestions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSavedQuestions_UserId",
                table: "UserSavedQuestions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AIRequestLogs");

            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "TestSessions");

            migrationBuilder.DropTable(
                name: "UserSavedQuestions");

            migrationBuilder.DropTable(
                name: "GeneratedQuestions");

            migrationBuilder.DropTable(
                name: "QuestionCategories");

            migrationBuilder.DropTable(
                name: "QuestionRequests");

            migrationBuilder.DropTable(
                name: "Skills");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
