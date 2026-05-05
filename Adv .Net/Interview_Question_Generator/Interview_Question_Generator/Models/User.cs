using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

[Index("Email", Name = "UQ__Users__A9D105348B63627A", IsUnique = true)]
public partial class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [StringLength(100)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [Required]
    [StringLength(100)]
    [Unicode(false)]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(255)]
    [Unicode(false)]
    public string Password { get; set; } = null!;

    [Required]
    public int RoleId { get; set; }

    public string? ProfileImageUrl { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<AirequestLog> AirequestLogs { get; set; } = new List<AirequestLog>();

    [InverseProperty("User")]
    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    [InverseProperty("User")]
    public virtual ICollection<QuestionRequest> QuestionRequests { get; set; } = new List<QuestionRequest>();

    [ForeignKey("RoleId")]
    [InverseProperty("Users")]
    public virtual Role Role { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<TestSession> TestSessions { get; set; } = new List<TestSession>();

    [InverseProperty("User")]
    public virtual ICollection<UserSavedQuestion> UserSavedQuestions { get; set; } = new List<UserSavedQuestion>();
}


public class UserDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public int RoleId { get; set; }

}

public class SubmitTestDto
{
    public List<SessionQuestionDto> Answers { get; set; } = new();
}

public class UpdateProfileImageDto
{
    public int UserId { get; set; }
    public string ProfileImageUrl { get; set; }
}

