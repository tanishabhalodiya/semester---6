using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

[Index("SkillName", Name = "UQ__Skills__B63C65710FB4FE2F", IsUnique = true)]
public partial class Skill
{
    [Key]
    public int SkillId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    [Required]
    public string SkillName { get; set; } = null!;

    [InverseProperty("Skill")]
    public virtual ICollection<QuestionRequest> QuestionRequests { get; set; } = new List<QuestionRequest>();

    [InverseProperty("Skill")]
    public virtual ICollection<TestSession> TestSessions { get; set; } = new List<TestSession>();
}

public class SkillDto
{
    public string SkillName { get; set; } = null!;

}