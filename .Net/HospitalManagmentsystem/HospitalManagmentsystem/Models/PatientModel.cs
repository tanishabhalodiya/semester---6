using System.ComponentModel.DataAnnotations;

namespace HospitalManagmentsystem.Models
{
    public class PatientModel
    {
        public int PatientID { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Date of Birth is required.")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Enter a valid email address.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Enter a valid phone number.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "City is required.")]
        public string City { get; set; }

        [Required(ErrorMessage = "State is required.")]
        public string State { get; set; }

        [Required(ErrorMessage = "Please select status.")]
        public Boolean IsActive { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? Modified { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public int UserID { get; set; }
    }

    public class PatientDropDownModel
    {
        public int PatientID { get; set; }
        public string Name { get; set; }
    }
}
