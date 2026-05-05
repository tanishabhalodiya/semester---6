using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Interview_Question_Generator.Models
{
    public class UploadedMcqFile
    {
        [Key]
        public int FileId { get; set; }
        [Required]
        public string FileName { get; set; }

        // either raw text OR cloud url
        [Required]
        public string FileContent { get; set; }

        [Required]
        public int UploadedBy { get; set; }

        [Required]
        public int UploadedUserUserId { get; set; }

        //[Required]
        //public User UploadedUser { get; set; }

        public DateTime UploadedAt { get; set; }
    }



    public class BulkMcqUploadDto
    {
        [FromForm(Name = "file")]
        public IFormFile File { get; set; }

        [FromForm(Name = "adminId")]
        public int AdminId { get; set; }

        [FromForm(Name = "skillId")]
        public int SkillId { get; set; }

        [FromForm(Name = "categoryId")]
        public int CategoryId { get; set; }

        [FromForm(Name = "difficulty")]
        public string Difficulty { get; set; }
    }


}


