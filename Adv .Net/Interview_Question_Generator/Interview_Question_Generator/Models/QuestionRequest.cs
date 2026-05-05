using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

public partial class QuestionRequest
{
    [Key]
    public int RequestId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int SkillId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? Difficulty { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Experience { get; set; }

    public string? SourceType { get; set; }        // TOPIC | TEXT | PDF | YOUTUBE | ADMIN
    public string? SourceContent { get; set; }     // text / summary
    public string? SourceUrl { get; set; }         // pdf path / youtube url
    public bool IsAiGenerated { get; set; }
    [Column(TypeName = "datetime")]

    public DateTime? RequestedAt { get; set; }

    

    [InverseProperty("Request")]
    public virtual ICollection<GeneratedQuestion> GeneratedQuestions { get; set; } = new List<GeneratedQuestion>();

    [ForeignKey("SkillId")]
    [InverseProperty("QuestionRequests")]
    public virtual Skill Skill { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("QuestionRequests")]
    public virtual User User { get; set; } = null!;

}

public class QuestionRequestDto
{
    public int UserId { get; set; }
    public int SkillId { get; set; }
    public string? Difficulty { get; set; }
    public string? Experience { get; set; }

}

