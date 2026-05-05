using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;
using ExcelDataReader;
using System.Data;


namespace Interview_Question_Generator.Controllers
{
    [Route("api/admin/mcq")]
    [ApiController]

    public class AdminMcqController : ControllerBase
    {
        private readonly InterviewContext _db;

        public AdminMcqController(InterviewContext db)
        {
            _db = db;
        }

        // ✅ GET: api/admin/mcq
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllMcqs()
        {
            var mcqs = await _db.GeneratedQuestions
                .Include(q => q.Category)
                .Include(q => q.Request)
                .Where(q => q.Request.SourceType == "ADMIN")
                .Select(q => new
                {
                    q.QuestionId,
                    q.QuestionText,
                    q.OptionsJson,
                    q.CorrectAnswer,
                    q.CategoryId,
                    Category = q.Category!.CategoryName,
                    q.Request.Difficulty
                })
                .ToListAsync();

            return Ok(mcqs);
        }

        // ✅ GET: api/admin/mcq/{id}
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMcqById(int id)
        {
            var mcq = await _db.GeneratedQuestions
                .Include(q => q.Request)
                .FirstOrDefaultAsync(q => q.QuestionId == id);

            if (mcq == null)
                return NotFound("MCQ not found");

            return Ok(new
            {
                mcq.QuestionId,
                mcq.QuestionText,
                mcq.OptionsJson,
                mcq.CorrectAnswer,
                mcq.CategoryId,
                mcq.Request.Difficulty
            });
        }

        // ✏️ PUT: api/admin/mcq/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMcq(int id, AdminMcqUpdateDto dto)
        {
            try
            {
                var mcq = await _db.GeneratedQuestions
                    .Include(q => q.Request)
                    .FirstOrDefaultAsync(q => q.QuestionId == id);

                if (mcq == null)
                    return NotFound("MCQ not found");

                mcq.QuestionText = dto.QuestionText;
                mcq.OptionsJson = JsonSerializer.Serialize(dto.Options);
                mcq.CorrectAnswer = dto.CorrectAnswer;
                mcq.CategoryId = dto.CategoryId;

                if (!string.IsNullOrEmpty(dto.Difficulty))
                    mcq.Request.Difficulty = dto.Difficulty;

                await _db.SaveChangesAsync();

                return Ok(new { message = "MCQ updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error updating MCQ",
                    error = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        // 🗑 DELETE: api/admin/mcq/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMcq(int id)
        {
            try
            {
                var mcq = await _db.GeneratedQuestions
                    .FirstOrDefaultAsync(q => q.QuestionId == id);

                if (mcq == null)
                    return NotFound("MCQ not found");

                _db.GeneratedQuestions.Remove(mcq);
                await _db.SaveChangesAsync();

                return Ok(new { message = "MCQ deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error deleting MCQ",
                    error = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddMcq(AdminMcqDto dto)
        {
            try
            {
                if (dto.SkillId == 0 || dto.CategoryId == 0 || string.IsNullOrEmpty(dto.Difficulty))
                {
                    return BadRequest(new { message = "Skill, Category and Difficulty are required" });
                }

                var request = new QuestionRequest
                {
                    UserId = dto.AdminId,
                    SkillId = dto.SkillId,
                    Difficulty = dto.Difficulty,
                    Experience = dto.Experience,
                    RequestedAt = DateTime.Now,
                    IsAiGenerated = false,
                    SourceType = "ADMIN"
                };

                _db.QuestionRequests.Add(request);
                await _db.SaveChangesAsync();

                var mcq = new GeneratedQuestion
                {
                    RequestId = request.RequestId,
                    CategoryId = dto.CategoryId,
                    QuestionText = dto.QuestionText,
                    OptionsJson = JsonSerializer.Serialize(dto.Options),
                    CorrectAnswer = dto.CorrectAnswer,
                    CreatedAt = DateTime.Now
                };

                _db.GeneratedQuestions.Add(mcq);
                await _db.SaveChangesAsync();

                return Ok(new { message = "MCQ added successfully", mcqId = mcq.QuestionId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error adding MCQ",
                    error = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        private string ExtractOption(string line)
        {
            if (string.IsNullOrWhiteSpace(line))
                return "";

            int index = line.IndexOf(')');
            if (index == -1 || index + 1 >= line.Length)
                return "";

            return line.Substring(index + 1).Trim();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("bulk-upload")]
        public async Task<IActionResult> BulkUploadMcqs([FromForm] BulkMcqUploadDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("File is required");


            using var reader = new StreamReader(dto.File.OpenReadStream());
            var content = await reader.ReadToEndAsync();
            var extension = Path.GetExtension(dto.File.FileName).ToLower();

             
            // Save uploaded file
            _db.UploadedMcqFiles.Add(new UploadedMcqFile
            {
                FileName = dto.File.FileName,
                FileContent = content,
                UploadedBy = dto.AdminId,
                UploadedUserUserId = dto.AdminId,
                UploadedAt = DateTime.Now
            });

            var request = new QuestionRequest
            {
                UserId = dto.AdminId,
                SkillId = dto.SkillId,
                Difficulty = dto.Difficulty,
                Experience = "Bulk Upload",
                RequestedAt = DateTime.Now,
                IsAiGenerated = false,
                SourceType = "ADMIN"
            };

            _db.QuestionRequests.Add(request);
            await _db.SaveChangesAsync();

            if (extension == ".xlsx")
            {
                var excelMcqs = ReadMcqsFromExcel(dto.File, request, dto.CategoryId);
                _db.GeneratedQuestions.AddRange(excelMcqs);
            }

            else if (extension == ".txt")
            {
                var blocks = content.Split("---", StringSplitOptions.RemoveEmptyEntries);

                foreach (var block in blocks)
                {
                    var lines = block
                        .Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(l => l.Trim())
                        .ToList();

                    if (lines.Count < 6)
                        continue;

                    if (!lines[0].StartsWith("Q:"))
                        continue;

                    var questionText = lines[0].Substring(2).Trim();

                    var options = new Dictionary<string, string>
                {
                    { "A", ExtractOption(lines[1]) },
                    { "B", ExtractOption(lines[2]) },
                    { "C", ExtractOption(lines[3]) },
                    { "D", ExtractOption(lines[4]) }
                };

                    if (options.Values.Any(v => string.IsNullOrWhiteSpace(v)))
                        continue;

                    var correctAnswer = lines[5]
                        .Replace("ANS:", "")
                        .Trim()
                        .Substring(0, 1)
                        .ToUpper();

                    _db.GeneratedQuestions.Add(new GeneratedQuestion
                    {
                        RequestId = request.RequestId,
                        CategoryId = dto.CategoryId,
                        QuestionText = questionText,
                        OptionsJson = JsonSerializer.Serialize(options),
                        CorrectAnswer = correctAnswer,
                        CreatedAt = DateTime.Now
                    });
                }
            }

            else
            {
                return BadRequest("Only .txt or .xlsx files are supported");
            }
                

            await _db.SaveChangesAsync();

            return Ok(new { message = "MCQs uploaded successfully" });
        }

        private List<GeneratedQuestion> ReadMcqsFromExcel(
            IFormFile file,
            QuestionRequest request,
            int categoryId
        )
        {
            var questions = new List<GeneratedQuestion>();

            using var stream = file.OpenReadStream();
            using var reader = ExcelReaderFactory.CreateReader(stream);

            var dataSet = reader.AsDataSet();
            var table = dataSet.Tables[0]; // First sheet

            for (int i = 1; i < table.Rows.Count; i++) // Skip header
            {
                var row = table.Rows[i];

                string question = row[0]?.ToString()?.Trim();
                string a = row[1]?.ToString()?.Trim();
                string b = row[2]?.ToString()?.Trim();
                string c = row[3]?.ToString()?.Trim();
                string d = row[4]?.ToString()?.Trim();
                string correct = row[5]?.ToString()?.Trim()?.ToUpper();

                if (string.IsNullOrWhiteSpace(question) ||
                    string.IsNullOrWhiteSpace(a) ||
                    string.IsNullOrWhiteSpace(b) ||
                    string.IsNullOrWhiteSpace(c) ||
                    string.IsNullOrWhiteSpace(d) ||
                    !"ABCD".Contains(correct))
                    continue;

                var options = new Dictionary<string, string>
                {
                    { "A", a },
                    { "B", b },
                    { "C", c },
                    { "D", d }
                };

                questions.Add(new GeneratedQuestion
                {
                    RequestId = request.RequestId,
                    CategoryId = categoryId,
                    QuestionText = question,
                    OptionsJson = JsonSerializer.Serialize(options),
                    CorrectAnswer = correct,
                    CreatedAt = DateTime.Now
                });
            }

            return questions;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("uploaded-files")]
        public async Task<IActionResult> GetUploadedFiles()
        {
            var files = await _db.UploadedMcqFiles
                .OrderByDescending(f => f.UploadedAt)
                .Select(f => new
                {
                    f.FileId,
                    f.FileName,
                    f.UploadedBy,
                    f.UploadedAt
                })
                .ToListAsync();

            return Ok(files);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            var file = await _db.UploadedMcqFiles.FindAsync(id);
            if (file == null) return NotFound();

            var bytes = Encoding.UTF8.GetBytes(file.FileContent);
            return File(bytes, "text/plain", file.FileName);
        }

        [HttpPut("update-file/{id}")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateFile(int id, IFormFile file)
        {
            var existing = await _db.UploadedMcqFiles.FindAsync(id);
            if (existing == null) return NotFound();

            using var reader = new StreamReader(file.OpenReadStream());
            existing.FileContent = await reader.ReadToEndAsync();
            existing.FileName = file.FileName;
            existing.UploadedAt = DateTime.Now;

            await _db.SaveChangesAsync();
            return Ok(new { message = "File updated" });
        }


    }
}
