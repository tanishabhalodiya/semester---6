using System.ComponentModel.DataAnnotations;

namespace HospitalManagmentsystem.Models
{
    public class DoctorModel
    {
        public int DoctorID { get; set; }

        [Required(ErrorMessage ="Name is required.")]
        [Length(6,30,ErrorMessage ="Length should be 6 to 30.")]

        public string Name { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage ="Enter valid phone number.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage ="Enter valid Email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Qualification is required.")]
        [StringLength(50, ErrorMessage ="Enter valid qualification.")]
        public string Qualification { get; set; }

        [Required(ErrorMessage = "Specialization is required.")]
        [StringLength(50, ErrorMessage = "Enter valid specialization.")]
        public string Specialization { get; set; }

        [Required(ErrorMessage ="Is Active is required.")]
        [Range(0, 1, ErrorMessage = "IsActive must be either 0 (Inactive) or 1 (Active).")]
        public Boolean IsActive { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Modified {  get; set; }

        [Required(ErrorMessage ="Please select User ID")]

        public int UserID {  get; set; }
        public IFormFile? ProfileImg { get; set; }
        public string? ProfileImgSrc { get; set; }

    }

    public class DoctorDropDownModel
    {
        public int DoctorID { get; set; }
        public string DoctorName { get; set; }
    }
}
