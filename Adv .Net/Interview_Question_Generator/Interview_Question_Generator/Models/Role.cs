using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Interview_Question_Generator.Models;

[Index("RoleName", Name = "UQ__Roles__8A2B6160F3734CCD", IsUnique = true)]
public partial class Role
{
    [Key]
    public int RoleId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    [Required]
    public string RoleName { get; set; } = null!;
        
    [InverseProperty("Role")]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}

//DTO is data transfer object that help to transfer data between client and server
public class RoleDto
{
    public string RoleName { get; set; } = null!;
}

