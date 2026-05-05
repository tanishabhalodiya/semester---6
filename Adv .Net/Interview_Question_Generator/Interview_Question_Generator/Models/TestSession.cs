using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

public partial class TestSession
{
    [Key]
    public int SessionId { get; set; }

    //[Required]
    public int? UserId { get; set; }

    [Required]
    public int SkillId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CompletedAt { get; set; }

    public string? UserAnswersJson { get; set; }
    public int? Score { get; set; }

    [ForeignKey("SkillId")]
    [InverseProperty("TestSessions")]
    public virtual Skill Skill { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("TestSessions")]
    public virtual User? User { get; set; } = null!;
}

public class TestSessionDto
{
    public int UserId { get; set; }
    public int SkillId { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    public string? UserAnswersJson { get; set; }

    public int? Score { get; set; }
}

public class CreateTestSessionDto
{
    public int SkillId { get; set; }
    public List<int> QuestionIds { get; set; } = new();
}
