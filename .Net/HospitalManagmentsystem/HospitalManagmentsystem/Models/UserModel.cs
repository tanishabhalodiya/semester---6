using System.ComponentModel.DataAnnotations;

namespace HospitalManagmentsystem.Models
{
    public class UserModel
    {
        public int UserID { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [Length(6, 30, ErrorMessage = "Length should be 6 to 30.")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, ErrorMessage = "Password must be at least 6 characters long.", MinimumLength = 6)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Enter valid Email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mobile number is required.")]
        [Phone(ErrorMessage = "Enter valid phone number.")]
        public string MobileNo { get; set; }

        [Required(ErrorMessage = "Please select isActive")]
        public Boolean IsActive { get; set; }


        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }


    }

    public class UserDropDownModel
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
    }


 
}
