using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly InterviewContext _db;
        public FeedbackController(InterviewContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var feedbacks = await _db.Feedbacks.ToListAsync();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting feedbacks", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var feedback = await _db.Feedbacks.FindAsync(id);
                if (feedback == null)
                {
                    return NotFound(new { message = "Feedback not found" });
                }
                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting feedback", error = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles="User")]
        public async Task<IActionResult> Create(FeedbackDto feedbackDto)
        {
            try
            {
                var feedback = new Feedback
                {
                    UserId = feedbackDto.UserId,
                    QuestionId = feedbackDto.QuestionId,
                    Rating = feedbackDto.Rating,
                    Comment = feedbackDto.Comment
                };
                _db.Feedbacks.Add(feedback);
                await _db.SaveChangesAsync();
                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting feedback", error = ex.Message });
            }
        }

        [HttpPut]
        [Authorize(Roles = "User")]

        public async Task<IActionResult> Update(FeedbackDto feedbackDto)
        {
            try
            {
                var feedback = await _db.Feedbacks.FirstOrDefaultAsync(f => f.UserId == feedbackDto.UserId && f.QuestionId == feedbackDto.QuestionId);
                if (feedback == null)
                {
                    return NotFound(new { message = "Feedback not found" });
                }
                feedback.Rating = feedbackDto.Rating;
                feedback.Comment = feedbackDto.Comment;
                await _db.SaveChangesAsync();
                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating feedback", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "User")]
            
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var feedback = await _db.Feedbacks.FindAsync(id);
                if (feedback == null)
                {
                    return NotFound(new { message = "Feedback not found" });
                }
                _db.Feedbacks.Remove(feedback);
                await _db.SaveChangesAsync();
                return Ok(new { message = "Feedback deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting feedback", error = ex.Message });
            }
        }
    }
}
