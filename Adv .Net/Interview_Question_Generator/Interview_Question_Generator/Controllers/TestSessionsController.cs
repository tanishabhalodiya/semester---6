using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User,Admin")]

    public class TestSessionsController : ControllerBase
    {
        private readonly InterviewContext _db;
        public TestSessionsController(InterviewContext db)
        {
            _db = db;
        }

        // GET: api/testsessions/
        //[HttpGet]
        //public async Task<IActionResult> GetAllSessions()
        //{
        //    try
        //    {
        //        var sessions = await _db.TestSessions
        //            .Select(s => new
        //            {
        //                s.SessionId,
        //                s.StartedAt,
        //                s.CompletedAt,
        //                s.Score,
        //                User = new
        //                {
        //                    s.User.UserId,
        //                    s.User.Name,
        //                    s.User.Email
        //                },
        //                Skill = new
        //                {
        //                    s.Skill.SkillId,
        //                    s.Skill.SkillName
        //                }
        //            })
        //            .ToListAsync();

        //        return Ok(sessions);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new
        //        {
        //            message = "Error fetching test sessions",
        //            error = ex.InnerException?.Message ?? ex.Message
        //        });
        //    }
        //}


        [HttpGet("admin/sessions")]
        public async Task<IActionResult> GetAdminSessions()
        {
            var sessions = await _db.TestSessions
                .Include(s => s.Skill)
                .ToListAsync();   // FIRST get data from DB

            var result = sessions.Select(s => new
            {
                s.SessionId,
                Skill = s.Skill.SkillName,
                s.StartedAt,
                s.CompletedAt,
                QuestionCount = string.IsNullOrEmpty(s.UserAnswersJson)
                    ? 0
                    : JsonSerializer.Deserialize<List<SessionQuestionDto>>(s.UserAnswersJson).Count
            }).ToList();

            return Ok(result);
        }



        // POST: api/testsessions/start
        //[HttpPost("start")]

        //public async Task<IActionResult> StartSession(TestSessionDto testSessionDto)
        //{
        //    var session = new TestSession
        //    {
        //        UserId = testSessionDto.UserId,
        //        SkillId = testSessionDto.SkillId,
        //        StartedAt = DateTime.Now,
        //        CompletedAt=testSessionDto.CompletedAt
        //    };
        //    _db.TestSessions.Add(session);
        //    await _db.SaveChangesAsync();
        //    return Ok(session);
        //}

        [HttpPost("admin/create-session")]
        public async Task<IActionResult> CreateSession(CreateTestSessionDto dto)
        {
            var session = new TestSession
            {
                SkillId = dto.SkillId,
                StartedAt = DateTime.Now,
                //UserAnswersJson = JsonSerializer.Serialize(
                //    dto.QuestionIds.Select(q => new { questionId = q, answer = (string?)null })
                //)
                UserAnswersJson = "[]"
            };

            _db.TestSessions.Add(session);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Test session created", sessionId = session.SessionId });
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateSession(int id, TestSessionDto testSessionDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var test = await _db.TestSessions.FindAsync(id);

                if (test == null)
                    return NotFound(new { message = "Test session not found" });

                test.SkillId = testSessionDto.SkillId;
                test.StartedAt = DateTime.Now;
                test.CompletedAt = testSessionDto.CompletedAt;

                _db.TestSessions.Update(test);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Test Session updated successfully", test });
            }

            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating Test session", error = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetTestSessionById(int id)
        {
            try
            {
                var test = await _db.TestSessions.FindAsync(id);
                if (test == null)
                    return NotFound(new { message = "Test Session not found" });

                return Ok(test);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting Test Session", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTestSession(int id)
        {
            try
            {
                var test = await _db.TestSessions.FindAsync(id);
                if (test == null)
                {
                    return NotFound(new { message = "Test Session not found" });
                }
                _db.TestSessions.Remove(test);
                await _db.SaveChangesAsync();
                return Ok(new { message = "Test Session deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting Test Session", error = ex.Message });
            }
        }

        [HttpPost("admin/assign-questions/{sessionId}")]
        public async Task<IActionResult> AssignQuestionsToSession(int sessionId, [FromBody] List<int> questionIds)
        {
            try
            {
                var session = await _db.TestSessions.FindAsync(sessionId);

                if (session == null)
                    return NotFound(new { message = "Session not found" });

                var data = questionIds.Select(q => new
                {
                    questionId = q,
                    answer = (string?)null
                }).ToList();

                session.UserAnswersJson = JsonSerializer.Serialize(data);

                await _db.SaveChangesAsync();

                return Ok(new { message = "Questions assigned successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error assigning questions",
                    error = ex.Message
                });
            }
        }

    }
}

