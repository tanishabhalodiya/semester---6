using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

[Table("Feedback")]
public partial class Feedback
{
    [Key]
    public int FeedbackId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int QuestionId { get; set; }

    [Required]
    public int Rating { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Comment { get; set; }

    [ForeignKey("QuestionId")]
    [InverseProperty("Feedbacks")]
    public virtual GeneratedQuestion Question { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Feedbacks")]
    public virtual User User { get; set; } = null!;
}

public class FeedbackDto
{
    public int UserId { get; set; }
    public int QuestionId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}