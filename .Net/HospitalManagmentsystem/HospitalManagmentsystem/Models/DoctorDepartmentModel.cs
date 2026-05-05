using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalManagmentsystem.Models
{
    public class DoctorDepartmentModel
    {
        public int DoctorDepartmentID { get; set; }

        [Required(ErrorMessage = "Please select a doctor.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Doctor selection.")]
        public int DoctorID { get; set; }

        [Required(ErrorMessage = "Please select a department.")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Department selection.")]
        public int DepartmentID { get; set; }

        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public int UserID { get; set; }
    }
}
