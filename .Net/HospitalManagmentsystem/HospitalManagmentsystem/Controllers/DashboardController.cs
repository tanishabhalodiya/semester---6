using HospitalManagmentsystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HospitalManagmentsystem.Controllers
{
    //we dont need to do login
    [AllowAnonymous]
    public class DashboardController : Controller
    {
        private readonly IConfiguration _config;
        public DashboardController(IConfiguration config) => _config = config;

        public IActionResult Index()
        {
            var vm = new Dashboard();
            string cs = _config.GetConnectionString("DefaultConnection");

            using (var con = new SqlConnection(cs))
            {
                con.Open();

                // 1) Summary counts
                using (var cmd = new SqlCommand("PR_Dashboard_Counts", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using var r = cmd.ExecuteReader();
                    if (r.Read())
                    {
                        vm.DoctorsCount = Convert.ToInt32(r["DoctorsCount"]);
                        vm.UsersCount = Convert.ToInt32(r["UsersCount"]);
                        vm.PatientsCount = Convert.ToInt32(r["PatientsCount"]);
                        vm.AppointmentsToday = Convert.ToInt32(r["AppointmentsToday"]);
                        vm.TotalDoctorsForPercent = vm.DoctorsCount;
                    }
                }

                // 2) Top specializations
                using (var cmd = new SqlCommand("PR_Dashboard_TopSpecializations", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using var r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        vm.TopSpecializations.Add(new TopSpec
                        {
                            Specialization = r["Specialization"].ToString() ?? "Unknown",
                            Count = Convert.ToInt32(r["Cnt"])
                        });
                    }
                }

                // 3) Recent activity (two result sets)
                using (var cmd = new SqlCommand("PR_Dashboard_Recent", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using var r = cmd.ExecuteReader();

                    while (r.Read())
                    {
                        vm.RecentDoctors.Add(new RecentItem
                        {
                            Id = Convert.ToInt32(r["Id"]),
                            Title = r["Title"].ToString() ?? "",
                            CreatedOn = Convert.ToDateTime(r["CreatedOn"]),
                            Type = "Doctor"
                        });
                    }

                    if (r.NextResult())
                    {
                        while (r.Read())
                        {
                            vm.RecentUsers.Add(new RecentItem
                            {
                                Id = Convert.ToInt32(r["Id"]),
                                Title = r["Title"].ToString() ?? "",
                                CreatedOn = Convert.ToDateTime(r["CreatedOn"]),
                                Type = "User"
                            });
                        }
                    }
                }
            }
            return View(vm);
        }
    }
}
