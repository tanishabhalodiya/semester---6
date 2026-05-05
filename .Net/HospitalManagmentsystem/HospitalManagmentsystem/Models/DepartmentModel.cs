using System.ComponentModel.DataAnnotations;

namespace HospitalManagmentsystem.Models
{
        public class DepartmentModel
        {
            public int? DepartmentID { get; set; }

            [Required(ErrorMessage = "Department name is required.")]
            public string DepartmentName { get; set; }

            [Required(ErrorMessage = "Description is required.")]
            public string Description { get; set; }

            [Required(ErrorMessage = "Please select status.")]
            public Boolean IsActive { get; set; }

            public DateTime? Created { get; set; }
            public DateTime? Modified { get; set; }

            [Required(ErrorMessage = "User ID is required.")]
            public int UserID { get; set; }
        
    }

    public class DepartmentDropDownModel
    {
        public int DepartmentID { get; set; }
        public string DepartmentName { get; set; }

    }
}
