using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

[Index("CategoryName", Name = "UQ__Question__8517B2E065A05B45", IsUnique = true)]
public partial class QuestionCategory
{
    [Key]
    public int CategoryId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    [Required]
    public string CategoryName { get; set; } = null!;

    [InverseProperty("Category")]
    public virtual ICollection<GeneratedQuestion> GeneratedQuestions { get; set; } = new List<GeneratedQuestion>();
}
public class QuestionCategoryDto
{
    public string CategoryName { get; set; } = null!;
}