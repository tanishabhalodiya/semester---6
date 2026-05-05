using Interview_Question_Generator.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Interview_Question_Generator.Controllers
{
    [ApiController]
    [Route("api/chat")]
    [Authorize(Roles = "User")]

    public class ChatController : ControllerBase
    {
        private readonly GeminiAiService _ai;

        public ChatController(GeminiAiService ai)
        {
            _ai = ai;
        }

        [HttpPost]
        public async Task<IActionResult> Chat(ChatRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest("Message is required");

            var reply = await _ai.GenerateChatAsync(
                dto.Message,
                dto.History ?? new List<ChatMessageDto>()
            );

            return Ok(new { reply });
        }
    }

    public class ChatRequestDto
    {
        public string Message { get; set; } = "";
        public List<ChatMessageDto> History { get; set; } = new();
    }
}