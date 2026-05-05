using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Interview_Question_Generator.Models;

[Table("AIRequestLogs")]
public partial class AirequestLog
{
    [Key]
    public int LogId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? RequestTime { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("AirequestLogs")]
    public virtual User User { get; set; } = null!;
}

public class AirequestLogDto
{
    public int UserId { get; set; }
    public DateTime? RequestTime { get; set; }

}

public class AiGenerateDto
{
    public int UserId { get; set; }
    public string Input { get; set; } = string.Empty;

    public string SourceType { get; set; } = "TEXT";
    public int Count { get; set; }
    public string Difficulty { get; set; } = "Easy";

    public string Type { get; set; } // MCQ | ONE_WORD | THEORY
}

public class AiMcqDto
{
    [JsonPropertyName("question")]
    public string Question { get; set; } = "";

    [JsonPropertyName("options")]
    public Dictionary<string, string>? Options { get; set; } = new();

    [JsonPropertyName("correct_Answer")]
    public string? Correct_Answer { get; set; } = "";

    public string? Answer { get; set; }
}


public class ChatRequestDto
{
    public string Message { get; set; }
    public List<ChatMessageDto> History { get; set; }
}

public class ChatMessageDto
{
    public string Role { get; set; } // "user" | "ai"
    public string Text { get; set; }
}


public class AiFileGenerateDto
{
    public IFormFile File { get; set; } = null!;
    public int Count { get; set; } = 30;
    public string Difficulty { get; set; } = "Easy";
}