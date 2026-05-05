using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionRequestsController : ControllerBase
    {
        private readonly InterviewContext _db;
        public QuestionRequestsController(InterviewContext db)
        {
            _db = db;
        }

        // GET: api/questionrequests
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "Question Requests API is running." });
        }

        // POST: api/questionrequests
        [HttpPost]
        public IActionResult Post(QuestionRequestDto requestDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            // Here you would typically process the request, e.g., save it to the database or generate questions.
            return Ok(new { message = "Question request received.", request = requestDto });
        }

        // GET: api/questionrequests/status
        [HttpGet]
        [Route("status")]
        public IActionResult Status()
        {
            return Ok(new { status = "Service is operational." });
        }

       
    }
}
