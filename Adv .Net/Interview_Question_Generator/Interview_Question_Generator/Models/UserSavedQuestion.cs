using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

public partial class UserSavedQuestion
{
    [Key]
    public int SaveId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int QuestionId { get; set; }

    [Required]
    [ForeignKey("QuestionId")]
    [InverseProperty("UserSavedQuestions")]
    public virtual GeneratedQuestion Question { get; set; } = null!;

    [Required]
    [ForeignKey("UserId")]
    [InverseProperty("UserSavedQuestions")]
    public virtual User User { get; set; } = null!;

}

public class UserSavedQuestionDto
{
    public int UserId { get; set; }
    public int QuestionId { get; set; }
}
