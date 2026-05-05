using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiRequestLogController : ControllerBase
    {

        private readonly InterviewContext _db;
        public AiRequestLogController(InterviewContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var logs = await _db.AirequestLogs.ToListAsync();
                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting AI request logs", error = ex.Message });
            }
        }


    }
}
