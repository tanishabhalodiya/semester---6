using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]

    public class UserSavedQuestionsController : ControllerBase
    {
        private readonly InterviewContext _db;
        public UserSavedQuestionsController(InterviewContext db)
        {
            _db = db;
        }


        //[HttpGet]
        //public async Task<IActionResult> GetAll()
        //{
        //    try
        //    {
        //        var savedQuestions = await _db.UserSavedQuestions

        //            .Include(x => x.Question)
        //            .Select(x => new
        //            {
        //                x.SaveId,
        //                x.UserId,
        //                x.QuestionId,
        //                question = new
        //                {
        //                    x.Question.QuestionText,
        //                    x.Question.OptionsJson,
        //                    x.Question.CorrectAnswer
        //                }
        //            })
        //            .ToListAsync();

        //        return Ok(savedQuestions);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = "Error getting user saved questions", error = ex.Message });
        //    }
        //}


        [HttpGet("user")]
        [Authorize]
        public async Task<IActionResult> GetByUser()
        {
            var userIdClaim = User.FindFirst("UserId");

            if (userIdClaim == null)
                return Unauthorized("UserId claim missing");

            int userId = int.Parse(userIdClaim.Value);

            var savedQuestions = await _db.UserSavedQuestions
                .Where(x => x.UserId == userId)
                .Include(x => x.Question)
                .Select(x => new
                {
                    x.QuestionId,
                    x.Question.QuestionText,
                    x.Question.OptionsJson,
                    x.Question.CorrectAnswer
                })
                .ToListAsync();

            var result = savedQuestions.Select(x => new
            {
                questionId = x.QuestionId,
                questionText = x.QuestionText,
                options = JsonSerializer.Deserialize<Dictionary<string, string>>(
                    x.OptionsJson ?? "{}"
                ),
                correctAnswer = x.CorrectAnswer
            });

            return Ok(result);
        }

        // POST: api/usersavedquestions
        [HttpPost]
        public async Task<IActionResult> Create(UserSavedQuestionDto userSavedQuestionDto)
        {
            try
            {
                var userSavedQuestion = new UserSavedQuestion
                {
                    UserId = userSavedQuestionDto.UserId,
                    QuestionId = userSavedQuestionDto.QuestionId
                };
                _db.UserSavedQuestions.Add(userSavedQuestion);
                await _db.SaveChangesAsync();
                return Ok(userSavedQuestion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error saving question for user", error = ex.Message });
            }

        }

        // GET: api/usersavedquestions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var savedQuestion = await _db.UserSavedQuestions.FindAsync(id);
                if (savedQuestion == null)
                {
                    return NotFound(new { message = "User saved question not found" });
                }
                return Ok(savedQuestion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting user saved question", error = ex.Message });
            }
        }

        // DELETE: api/usersavedquestions

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var savedQuestion = await _db.UserSavedQuestions.FindAsync(id);
                if (savedQuestion == null)
                {
                    return NotFound(new { message = "User saved question not found" });
                }
                _db.UserSavedQuestions.Remove(savedQuestion);
                await _db.SaveChangesAsync();
                return Ok(new { message = "User saved question deleted successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error   deleting user saved question", error = ex.Message });
            }
        }

    }
}
