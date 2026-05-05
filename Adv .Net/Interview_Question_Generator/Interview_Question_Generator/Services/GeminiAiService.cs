using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace Interview_Question_Generator.Services
{
    public class GeminiAiService
    {
        private readonly string _apiKey;
        private readonly HttpClient _http;

        public GeminiAiService(IConfiguration config)
        {
            _apiKey = config["Gemini:ApiKey"]
                ?? throw new InvalidOperationException("Gemini API key missing");

            _http = new HttpClient();
        }

        // ================= EXISTING (DO NOT CHANGE) =================
        public async Task<string> GenerateAsync(string prompt)
        {
            return await CallGemini(prompt);
        }

        // ================= NEW: CHATBOT SUPPORT =================
        public async Task<string> GenerateChatAsync(
            string message,
            List<ChatMessageDto> history
        )
        {
            var context = string.Join("\n",
                history.Select(h => $"{h.Role}: {h.Text}")
            );

            var prompt = $"""
You are IQG AI, an interview preparation assistant.
Answer clearly, concisely, and with examples if helpful.

Conversation so far:
{context}

User: {message}
AI:
""";

            return await CallGemini(prompt);
        }

        // ================= COMMON GEMINI CALL =================
        private async Task<string> CallGemini(string prompt)
        {
            var url =
                $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={_apiKey}";

            var body = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var response = await _http.PostAsync(
                url,
                new StringContent(
                    JsonSerializer.Serialize(body),
                    Encoding.UTF8,
                    "application/json"
                )
            );

            var rawResponse = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception(rawResponse);

            using var doc = JsonDocument.Parse(rawResponse);

            return doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? "";
        }
    }

    // 🔹 Chat DTOs
    public class ChatMessageDto
    {
        public string Role { get; set; } = "";
        public string Text { get; set; } = "";
    }
}