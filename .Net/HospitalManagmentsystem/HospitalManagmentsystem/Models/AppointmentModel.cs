using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalManagmentsystem.Models
{
    public class AppointmentModel
    {
        public int? AppointmentID { get; set; }

        [Required(ErrorMessage = "Doctor is required.")]
        public int DoctorID { get; set; }

        [Required(ErrorMessage = "Patient is required.")]
        public int PatientID { get; set; }

        [Required(ErrorMessage = "Appointment date is required.")]
      
        public DateTime AppointmentDate { get; set; }

        [Required(ErrorMessage = "Appointment status is required.")]
        public string AppointmentStatus { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; }

        [StringLength(200, ErrorMessage = "Special remarks cannot exceed 200 characters.")]
        public string SpecialRemarks { get; set; }

        public DateTime? Created { get; set; }
        public DateTime? Modified { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public int UserID { get; set; }

        [Required(ErrorMessage = "Consulted amount is required.")]
       
        public double TotalConsultedAmount { get; set; }
    }
}
