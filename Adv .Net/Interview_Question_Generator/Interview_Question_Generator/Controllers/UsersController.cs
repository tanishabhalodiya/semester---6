using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Text.Json;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class UsersController : ControllerBase
    {
        private readonly InterviewContext _db;
        public UsersController(InterviewContext db)
        {
            _db = db;
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _db.Users.ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting users", error = ex.Message });
            }

        }

        [Authorize(Roles="User,Admin")]
        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _db.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting user", error = ex.Message });
            }
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> Create(UserDto userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var user = new User
                {
                    Name = userDto.Name,
                    Email = userDto.Email,
                    Password = userDto.Password,
                    RoleId = userDto.RoleId
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = user.UserId }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating user", error = ex.Message });
            }
        }

        
        [HttpGet("saved")]
        public async Task<IActionResult> GetSavedMcqs()
        {
            var userId = int.Parse(User.FindFirst("UserId")!.Value);
            // 1️⃣ Fetch raw data from database (NO JsonSerializer here)
            var mcqsFromDb = await _db.GeneratedQuestions
                .Include(q => q.Request)
                .Where(q =>
                    q.Request != null &&
                    q.Request.UserId == userId &&
                    q.Request.IsAiGenerated
                )
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new
                {
                    q.QuestionId,
                    q.QuestionText,
                    q.OptionsJson,
                    q.CorrectAnswer,
                    q.CreatedAt
                })
                .ToListAsync();

            // 2️⃣ Convert JSON → Dictionary AFTER DB call
            var result = mcqsFromDb.Select(q => new
            {
                q.QuestionId,
                q.QuestionText,
                Options = string.IsNullOrEmpty(q.OptionsJson)
                    ? new Dictionary<string, string>()
                    : JsonSerializer.Deserialize<Dictionary<string, string>>(q.OptionsJson)!,
                q.CorrectAnswer,
                q.CreatedAt
            });

            return Ok(result);
        }
        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserDto userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _db.Users.FindAsync(id);

                if (user == null)
                    return NotFound(new { message = "User not found" });

                user.Name = userDto.Name;
                user.Email = userDto.Email;
                user.Password = userDto.Password;

                _db.Users.Update(user);
                await _db.SaveChangesAsync();

                return Ok(new { message = "User updated successfully", user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", error = ex.Message });
            }
        }


        //Delete: api/users/5
        [Authorize(Roles="Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var user = await _db.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { message = "User not found" });
                _db.Users.Remove(user);
                await _db.SaveChangesAsync();
                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user", error = ex.Message });
            }

        }

        [HttpGet("user/available")]
        public async Task<IActionResult> GetAvailableSessions()
        {
            var sessions = await _db.TestSessions
                .Where(s => s.CompletedAt == null)
                .Include(s => s.Skill)
                .Select(s => new
                {
                    s.SessionId,
                    Skill = s.Skill.SkillName,
                    s.StartedAt
                })
                .ToListAsync();

            return Ok(sessions);
        }

        [HttpGet("user/session/{sessionId}")]
        public async Task<IActionResult> GetSessionQuestions(int sessionId)
        {
            var session = await _db.TestSessions.FindAsync(sessionId);
            if (session == null) return NotFound();

            var list = JsonSerializer.Deserialize<List<SessionQuestionDto>>(session.UserAnswersJson);

            var questionIds = list.Select(x => x.questionId).ToList();

            var questions = await _db.GeneratedQuestions
                .Where(q => questionIds.Contains(q.QuestionId))
                .Select(q => new
                {
                    q.QuestionId,
                    q.QuestionText,
                    q.OptionsJson
                })
                .ToListAsync();

            return Ok(questions);
        }


        [HttpPost("user/submit/{sessionId}")]
        [Authorize]
        public async Task<IActionResult> SubmitTest(int sessionId, SubmitTestDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var answersResult = new List<object>();
            int score = 0;

            foreach (var a in dto.Answers)
            {
                var question = await _db.GeneratedQuestions
                    .FirstOrDefaultAsync(q => q.QuestionId == a.questionId);

                if (question == null) continue;

                bool isCorrect = question.CorrectAnswer == a.answer;

                if (isCorrect) score++;

                answersResult.Add(new
                {
                    questionId = a.questionId,
                    userAnswer = a.answer,
                    correctAnswer = question.CorrectAnswer,
                    isCorrect
                });
            }

            var session = await _db.TestSessions.FindAsync(sessionId);
            session.UserAnswersJson = JsonSerializer.Serialize(answersResult);
            session.Score = score;

            await _db.SaveChangesAsync();

            return Ok(new { score });
        }


        [HttpGet("user/results")]
        [Authorize]
        public async Task<IActionResult> GetUserResults()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var results = await _db.TestSessions
                .Where(t => t.UserId == userId && t.Score != null)
                .OrderBy(t => t.CompletedAt)
                .Select(t => new
                {
                    t.SessionId,
                    score = t.Score
                })
                .ToListAsync();

            return Ok(results);
        }


        [HttpPut("profile-image")]
        public async Task<IActionResult> UpdateProfileImage(UpdateProfileImageDto dto)
        {
            var user = await _db.Users.FindAsync(dto.UserId);
            if (user == null) return NotFound("User not found");

            user.ProfileImageUrl = dto.ProfileImageUrl;
            await _db.SaveChangesAsync();

            return Ok("Profile image updated");
        }

    }
}
