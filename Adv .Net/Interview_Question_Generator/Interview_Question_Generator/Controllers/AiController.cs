using Interview_Question_Generator.Models;
using Interview_Question_Generator.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Interview_Question_Generator.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly GeminiAiService _ai;
        private readonly InterviewContext _db;
        private readonly FileTextExtractorService _fileTextExtractor;

        public AiController(
            GeminiAiService ai,
            InterviewContext db,
            FileTextExtractorService fileTextExtractor)
        {
            _ai = ai;
            _db = db;
            _fileTextExtractor = fileTextExtractor;
        }

        // ===================== GENERATE FROM TEXT / TOPIC =====================
        [HttpPost("generate")]
        [Authorize(Roles = "User")]

        public async Task<IActionResult> Generate([FromBody] AiGenerateDto dto)
        {
            var aiResponse = await _ai.GenerateAsync(BuildPrompt(dto));
            return ParseMcqsFromGemini(aiResponse,dto.Count);
        }



        [HttpPost("generate-from-file")]
        // [Authorize] // keep commented until JWT testing
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "User")]

        public async Task<IActionResult> GenerateFromFile(
    [FromForm] AiFileGenerateDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("File is required");

            int count = dto.Count <= 0 ? 30 : dto.Count;
            string difficulty = string.IsNullOrWhiteSpace(dto.Difficulty)
                ? "Easy"
                : dto.Difficulty;

            var text = await _fileTextExtractor.ExtractText(dto.File);

            if (string.IsNullOrWhiteSpace(text))
                return BadRequest("Could not extract text from file");

            var prompt = $@"
Generate EXACTLY {count} {difficulty} MCQs.

Rules:
- Return EXACTLY {count} questions
- JSON array only
- Fields: question, options, correct_answer

Content:
{text}
";

            var aiResponse = await _ai.GenerateAsync(prompt);
            return ParseMcqsFromGemini(aiResponse, count);
        }


        [HttpPost("save-bulk")]
        [Authorize(Roles = "User")]

        [Authorize]
        public async Task<IActionResult> SaveBulk([FromBody] List<AiMcqDto> mcqs)
        {
            if (mcqs == null || mcqs.Count == 0)
                return BadRequest("No MCQs to save");

            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim == null)
                return Unauthorized("UserId claim missing");

            int userId = int.Parse(userIdClaim.Value);

            var generatedQuestions = mcqs.Select(mcq => new GeneratedQuestion
            {
                RequestId = null,
                CategoryId = 3, // ⚠ ensure exists
                QuestionText = mcq.Question,
                OptionsJson = JsonSerializer.Serialize(mcq.Options),
                CorrectAnswer = mcq.Correct_Answer,
                CreatedAt = DateTime.Now
            }).ToList();

            _db.GeneratedQuestions.AddRange(generatedQuestions);
            await _db.SaveChangesAsync();

            var userSavedQuestions = generatedQuestions.Select(q => new UserSavedQuestion
            {
                UserId = userId,
                QuestionId = q.QuestionId
            }).ToList();

            _db.UserSavedQuestions.AddRange(userSavedQuestions);
            await _db.SaveChangesAsync();

            return Ok(new { message = "MCQs saved successfully" });
        }

        // ===================== PARSER (REPLACES ProcessGeminiResponse) =====================
        //private IActionResult ParseMcqsFromGemini(string aiResponse, int expectedCount)
        //{
        //    var cleaned = aiResponse
        //        .Replace("```json", "", StringComparison.OrdinalIgnoreCase)
        //        .Replace("```", "")
        //        .Trim();

        //    JsonElement root;
        //    try
        //    {
        //        root = JsonSerializer.Deserialize<JsonElement>(cleaned);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new
        //        {
        //            error = "Invalid MCQ JSON",
        //            raw = cleaned,
        //            message = ex.Message
        //        });
        //    }

        //    if (root.ValueKind != JsonValueKind.Array)
        //    {
        //        return BadRequest(new
        //        {
        //            error = "MCQ JSON is not an array",
        //            raw = cleaned
        //        });
        //    }

        //    var result = new List<AiMcqDto>();

        //    foreach (var item in root.EnumerateArray())
        //    {
        //        if (!item.TryGetProperty("question", out var qProp))
        //            continue;

        //        var mcq = new AiMcqDto
        //        {
        //            Question = qProp.GetString() ?? "",
        //            Options = new Dictionary<string, string>()
        //        };

        //        if (item.TryGetProperty("options", out var opts) &&
        //            opts.ValueKind == JsonValueKind.Array)
        //        {
        //            char key = 'A';
        //            foreach (var opt in opts.EnumerateArray())
        //            {
        //                mcq.Options[key.ToString()] = opt.GetString() ?? "";
        //                key++;
        //            }
        //        }

        //        if (item.TryGetProperty("correct_answer", out var ca))
        //        {
        //            var ans = ca.GetString();
        //            mcq.Correct_Answer =
        //                mcq.Options.FirstOrDefault(o => o.Value == ans).Key ?? "A";
        //        }

        //        result.Add(mcq);
        //    }

        //    return Ok(result.Take(expectedCount).ToList());
        //}
        private IActionResult ParseMcqsFromGemini(string aiResponse, int expectedCount)
        {
            var cleaned = aiResponse
                .Replace("```json", "", StringComparison.OrdinalIgnoreCase)
                .Replace("```", "")
                .Trim();

            JsonElement root;
            try { root = JsonSerializer.Deserialize<JsonElement>(cleaned); }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Invalid MCQ JSON", raw = cleaned, message = ex.Message });
            }

            if (root.ValueKind != JsonValueKind.Array)
                return BadRequest(new { error = "MCQ JSON is not an array", raw = cleaned });

            var result = new List<AiMcqDto>();

            foreach (var item in root.EnumerateArray())
            {
                if (!item.TryGetProperty("question", out var qProp)) continue;

                var mcq = new AiMcqDto
                {
                    Question = qProp.GetString() ?? "",
                    Options = new Dictionary<string, string>()
                };

                // ── MCQ: options array ──────────────────────────────────────
                if (item.TryGetProperty("options", out var opts) &&
                    opts.ValueKind == JsonValueKind.Array)
                {
                    char key = 'A';
                    foreach (var opt in opts.EnumerateArray())
                    {
                        mcq.Options[key.ToString()] = opt.GetString() ?? "";
                        key++;
                    }
                }

                // ── MCQ: correct_answer (letter A/B/C/D or full text) ───────
                if (item.TryGetProperty("correct_answer", out var ca))
                {
                    var ans = ca.GetString() ?? "";
                    // If answer is a letter key (A/B/C/D), use directly
                    // If answer is full text, find which option key matches
                    if (mcq.Options.ContainsKey(ans.ToUpper()))
                        mcq.Correct_Answer = ans.ToUpper();
                    else
                        mcq.Correct_Answer = mcq.Options
                            .FirstOrDefault(o => o.Value == ans).Key ?? ans;
                }

                // ── ONE_WORD / THEORY: "answer" field ───────────────────────
                // 🔴 THIS WAS MISSING — the reason one-word answers were empty
                if (string.IsNullOrEmpty(mcq.Correct_Answer) &&
                    item.TryGetProperty("answer", out var directAnswer))
                {
                    mcq.Correct_Answer = directAnswer.GetString() ?? "";
                }

                result.Add(mcq);
            }

            return Ok(result.Take(expectedCount).ToList());
        }

        // ===================== PROMPT BUILDER =====================
        private string BuildPrompt(AiGenerateDto dto)
        {
            if (dto.Type == "ONE_WORD")
            {
                return $@"
Generate {dto.Count} {dto.Difficulty} one-word questions.

Content:
{dto.Input}

Rules:
- JSON array
- Fields: question, answer
";
            }

            if (dto.Type == "THEORY")
            {
                return $@"
Generate {dto.Count} {dto.Difficulty} theory questions.

Content:
{dto.Input}

Rules:
- JSON array
- Fields: question, answer
";
            }

            // DEFAULT MCQ
            return $@"
Generate {dto.Count} {dto.Difficulty} MCQs.

Content:
{dto.Input}

Rules:
- JSON array only
- Fields: question, options, correct_answer
";
        }
    }
}