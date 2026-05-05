using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneratedQuestionsController : ControllerBase
    {
        private readonly InterviewContext _db;
        public GeneratedQuestionsController(InterviewContext db)
        {
            _db = db;
        }

        // GET: api/generatedquestions
        [HttpGet]
        [Authorize(Roles = "User,Admin")]

        public async Task<IActionResult> GetAll()
        {
            try
            {
                var questions = await _db.GeneratedQuestions.ToListAsync();
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting generated questions", error = ex.Message });
            }
        }





        // GET: api/generatedquestions/5
        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]

        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var question = await _db.GeneratedQuestions.FindAsync(id);
                if (question == null)
                    return NotFound(new { message = "Generated question not found" });
                return Ok(question);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting generated question", error = ex.Message });
            }
        }

        //POST: api/generatedquestions
        [HttpPost]

        public async Task<IActionResult> Create([FromBody] GeneratedQuestionDto questionDto)
        {
            try
            {
                var question = new GeneratedQuestion
                {
                    RequestId = questionDto.RequestId,
                    CategoryId = questionDto.CategoryId,
                    QuestionText = questionDto.QuestionText,
                    CreatedAt = DateTime.UtcNow
                };
                _db.GeneratedQuestions.Add(question);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = question.QuestionId }, question);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating generated question", error = ex.Message });
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,GeneratedQuestionDto questionDto)
        {
            try
            {
                var question = await _db.GeneratedQuestions.FindAsync(id);
                if (question == null)
                    return NotFound(new { message = "Generated question not found" });
                question.RequestId = questionDto.RequestId;
                question.CategoryId = questionDto.CategoryId;
                question.QuestionText = questionDto.QuestionText;
                await _db.SaveChangesAsync();
                return Ok(question);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating generated question", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var question = await _db.GeneratedQuestions.FindAsync(id);
                if (question == null)
                    return NotFound(new { message = "Generated question not found" });
                _db.GeneratedQuestions.Remove(question);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting generated question", error = ex.Message });
            }
        }


        // GET: api/GeneratedQuestions/filter
        [HttpGet("filter")]
        [Authorize(Roles = "User")]

        public async Task<IActionResult> FilterQuestions(int skillId, int categoryId, string difficulty)
        {
            Console.WriteLine($"FILTER HIT → SkillId={skillId}, CategoryId={categoryId}, Difficulty={difficulty}");

            try
            {
                var questions = await _db.GeneratedQuestions
                    .Include(q => q.Request)
                    .Where(q =>
                        q.CategoryId == categoryId &&
                        q.Request.SkillId == skillId &&
                        q.Request.Difficulty == difficulty
                    )
                    .Select(q => new
                    {
                        q.QuestionId,
                        q.QuestionText,
                        q.CategoryId,
                        SkillId = q.Request.SkillId,
                        Difficulty = q.Request.Difficulty
                    })
                    .ToListAsync();

                return Ok(questions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
