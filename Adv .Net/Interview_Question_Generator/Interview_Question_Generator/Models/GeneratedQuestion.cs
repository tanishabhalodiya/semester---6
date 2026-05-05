using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

public partial class GeneratedQuestion
{
    [Key]
    public int QuestionId { get; set; }

    //[Required]
    public int? RequestId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Column(TypeName = "text")]
    [Required]
    public string QuestionText { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    public string? OptionsJson { get; set; }    // JSON: { "A":"...", "B":"..." }

 
    public string? CorrectAnswer { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("GeneratedQuestions")]
    public virtual QuestionCategory? Category { get; set; }

    [InverseProperty("Question")]
    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    [ForeignKey("RequestId")]
    [InverseProperty("GeneratedQuestions")]
    public virtual QuestionRequest Request { get; set; } = null!;

    [InverseProperty("Question")]
    public virtual ICollection<UserSavedQuestion> UserSavedQuestions { get; set; } = new List<UserSavedQuestion>();
}

public class GeneratedQuestionDto
{
    public int? RequestId { get; set; }
    public int CategoryId { get; set; }
    public string QuestionText { get; set; } = null!;

}

public class AdminMcqDto
{
    public int AdminId { get; set; }
    public int SkillId { get; set; }
    public int CategoryId { get; set; }

    public string Difficulty { get; set; } = null!;
    public string? Experience { get; set; }

    public string QuestionText { get; set; } = null!;

    // MCQ support
    public Dictionary<string, string> Options { get; set; } = null!;
    public string CorrectAnswer { get; set; } = null!;
}

public class AdminMcqUpdateDto
{
    public string QuestionText { get; set; } = null!;

    // { "A": "...", "B": "...", "C": "...", "D": "..." }
    public Dictionary<string, string> Options { get; set; } = new();

    public string CorrectAnswer { get; set; } = null!;

    public int CategoryId { get; set; }

    public string? Difficulty { get; set; }
}


public class SessionQuestionDto
{
    public int questionId { get; set; }
    public string? answer { get; set; }
}
