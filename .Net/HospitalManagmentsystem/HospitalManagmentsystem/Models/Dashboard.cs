namespace HospitalManagmentsystem.Models
{
    public class Dashboard
    {
        public int DoctorsCount { get; set; }
        public int UsersCount { get; set; }
        public int PatientsCount { get; set; }          // optional
        public int AppointmentsToday { get; set; }      // optional

        public List<TopSpec> TopSpecializations { get; set; } = new();
        public List<RecentItem> RecentDoctors { get; set; } = new();
        public List<RecentItem> RecentUsers { get; set; } = new();

        // Convenience: total for percentages
        public int TotalDoctorsForPercent { get; set; }
    }

    public class TopSpec
    {
        public string Specialization { get; set; } = "";
        public int Count { get; set; }
    }

    public class RecentItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public DateTime CreatedOn { get; set; }
        public string Type { get; set; } = ""; // "Doctor" or "User"
    }
}
