using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;

namespace Interview_Question_Generator.Controllers
{
    [ApiController]
    [Route("api/ai/models")]
    public class GeminiModelsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public GeminiModelsController(
            IConfiguration config,
            IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public async Task<IActionResult> GetAvailableModels()
        {
            var apiKey = _config["Gemini:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return BadRequest("Gemini API key not configured");

            var client = _httpClientFactory.CreateClient();

            // Try BOTH endpoints (Google is inconsistent)
            var urls = new[]
            {
                $"https://generativelanguage.googleapis.com/v1/models?key={apiKey}",
                $"https://generativelanguage.googleapis.com/v1beta/models?key={apiKey}"
            };

            foreach (var url in urls)
            {
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode) continue;

                var json = await response.Content.ReadAsStringAsync();
                return Ok(new
                {
                    source = url,
                    rawResponse = JsonDocument.Parse(json).RootElement
                });
            }

            return StatusCode(500, "Unable to fetch Gemini models. Check API key & API enablement.");
        }
    }
}
