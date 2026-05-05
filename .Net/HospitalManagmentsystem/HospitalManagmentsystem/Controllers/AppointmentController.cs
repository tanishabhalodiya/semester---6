using ClosedXML.Excel;
using HospitalManagmentsystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
//using System.Data.SqlClient;

using ClosedXML.Excel;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace HospitalManagmentsystem.Controllers
{
    [CheckAccess]
    public class AppointmentController : Controller
    {
        //taking connection string from configuration
        private IConfiguration configuration;
        public AppointmentController(IConfiguration _configuration)
        {
            configuration = _configuration;

        }
        public IActionResult AppointmentList()
        {
            //DB connectivity
            string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
            //need to give connectionstring to sql class
            SqlConnection connection = new SqlConnection(ConnetionString);

            //we open database 
            connection.Open();

            //we write command
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Appointment_Select_All";

            SqlDataReader reader = command.ExecuteReader();

            //cathing value in table 
            DataTable table = new DataTable();
            table.Load(reader);
            return View(table);
        }
        public SelectList getUserDropdown()
        {
            string connectionString = this.configuration.GetConnectionString("DefaultConnection");
            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_User_SelectForDropDown";

            SqlDataReader reader = command.ExecuteReader();
            DataTable dataTable = new DataTable();
            dataTable.Load(reader);

            List<UserDropDownModel> userList = new List<UserDropDownModel>();
            foreach (DataRow data in dataTable.Rows)
            {
                //UserDropDownModel model = new UserDropDownModel();
                //model.UserID = Convert.ToInt32(data["UserID"]);
                //model.UserName = data["UserName"].ToString();
                //userList.Add(model);
                userList.Add(new UserDropDownModel { UserID = Convert.ToInt32(data["UserID"]),
                    UserName=data["UserName"].ToString()
                });
            }
            connection.Close();
            return new SelectList(userList, "UserID", "UserName");
        }
        public SelectList getDoctorDropdown()
        {
            string connectionString = this.configuration.GetConnectionString("DefaultConnection");
            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Doctor_SelectForDropDown";

            SqlDataReader reader = command.ExecuteReader();
            DataTable dataTable = new DataTable();
            dataTable.Load(reader);

            List<DoctorDropDownModel> doctorList = new List<DoctorDropDownModel>();
            foreach (DataRow data in dataTable.Rows)
            {
                //DoctorDropDownModel model = new DoctorDropDownModel();
                //model.DoctorID = Convert.ToInt32(data["DoctorID"]);
                //model.DoctorName = data["Name"].ToString();
                //doctorList.Add(model);
                doctorList.Add(new DoctorDropDownModel
                {
                    DoctorID = Convert.ToInt32(data["DoctorID"]),
                    DoctorName = data["Name"].ToString()
                });

            }
            connection.Close();
            return new SelectList(doctorList, "DoctorID", "DoctorName");
        }

        public SelectList getPatientDropdown()
        {
            string connectionString = this.configuration.GetConnectionString("DefaultConnection");
            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Patient_SelectForDropDown";

            SqlDataReader reader = command.ExecuteReader();
            DataTable dataTable = new DataTable();
            dataTable.Load(reader);

            List<PatientDropDownModel> patientList = new List<PatientDropDownModel>();
            foreach (DataRow data in dataTable.Rows)
            {
                //PatientDropDownModel model = new PatientDropDownModel();
                //model.PatientID = Convert.ToInt32(data["PatientID"]);
                //model.Name = data["Name"].ToString();
                //patientList.Add(model);
                patientList.Add(new PatientDropDownModel
                {
                    PatientID = Convert.ToInt32(data["PatientID"]),
                    Name = data["Name"].ToString()
                });
            }
            connection.Close();
            return new SelectList(patientList, "PatientID", "Name");
        }


        public IActionResult AppointmentDelete(int AppointmentID)
        {
            //DB connectivity
            string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
            //need to give connectionstring to sql class
            SqlConnection connection = new SqlConnection(ConnetionString);

            //we open database 
            connection.Open();

            //we write command
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Appointment_DELETE";
            command.Parameters.Add("@AppointmentID",SqlDbType.Int).Value= AppointmentID;
            command.ExecuteNonQuery();
            return RedirectToAction("AppointmentList");
        }

        [HttpGet]
        public IActionResult AppointmentAddEdit()
        {
            ViewBag.UserList = getUserDropdown();
            ViewBag.DoctorList = getDoctorDropdown();
            ViewBag.PatientList = getPatientDropdown();
            return View(new AppointmentModel());
        }


        [HttpPost]
        public IActionResult AppointmentAddEdit(AppointmentModel appointmentModel)
        {
            ViewBag.UserList = getUserDropdown();
            ViewBag.DoctorList = getDoctorDropdown();
            ViewBag.PatientList = getPatientDropdown();

            if (ModelState.IsValid)
            {
                string connectionString = configuration.GetConnectionString("DefaultConnection");
                SqlConnection connection = new SqlConnection(connectionString);
                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;

                if (appointmentModel.AppointmentID == 0 || appointmentModel.AppointmentID == null)
                {
                    command.CommandText = "PR_Appointment_Insert";
                }
                else
                {
                    command.CommandText = "PR_Appointment_Update";
                    command.Parameters.Add("@AppointmentID", SqlDbType.Int).Value = appointmentModel.AppointmentID;
                }

                command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = appointmentModel.DoctorID;
                command.Parameters.Add("@PatientID", SqlDbType.Int).Value = appointmentModel.PatientID;
                command.Parameters.Add("@AppointmentDate", SqlDbType.Date).Value = appointmentModel.AppointmentDate;
                command.Parameters.Add("@AppointmentStatus", SqlDbType.NVarChar).Value = appointmentModel.AppointmentStatus;
                command.Parameters.Add("@Description", SqlDbType.NVarChar).Value = appointmentModel.Description ?? (object)DBNull.Value;
                command.Parameters.Add("@SpecialRemarks", SqlDbType.NVarChar).Value = appointmentModel.SpecialRemarks ?? (object)DBNull.Value;
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = appointmentModel.UserID;
                command.Parameters.Add("@TotalConsultedAmount", SqlDbType.Decimal).Value = appointmentModel.TotalConsultedAmount;

                command.ExecuteNonQuery();
                return RedirectToAction("AppointmentList");
            }

            return View(new AppointmentModel());
        }

        // ✅ Fill data for Edit form
        public IActionResult AppointmentFillData(int? AppointmentID)
        {
            ViewBag.UserList = getUserDropdown();
            ViewBag.DoctorList = getDoctorDropdown();
            ViewBag.PatientList = getPatientDropdown();

            if (AppointmentID == null || AppointmentID == 0)    
            {
                return View("AppointmentAddEdit", new AppointmentModel());
            }

            string connectionString = configuration.GetConnectionString("DefaultConnection");
            SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Appointment_Select_By";
            command.Parameters.Add("@AppointmentID", SqlDbType.Int).Value = AppointmentID;

            SqlDataReader reader = command.ExecuteReader();
            DataTable table = new DataTable();
            table.Load(reader);

            AppointmentModel model = new AppointmentModel();
            if (table.Rows.Count > 0)
            {
                DataRow dr = table.Rows[0];
                model.AppointmentID = Convert.ToInt32(dr["AppointmentID"]);
                model.DoctorID = Convert.ToInt32(dr["DoctorID"]);
                model.PatientID = Convert.ToInt32(dr["PatientID"]);
                model.AppointmentDate = Convert.ToDateTime(dr["AppointmentDate"]);
                model.AppointmentStatus = dr["AppointmentStatus"].ToString();
                model.Description = dr["Description"].ToString();
                model.SpecialRemarks = dr["SpecialRemarks"].ToString();
                model.UserID = Convert.ToInt32(dr["UserID"]);
                model.TotalConsultedAmount = Convert.ToDouble(dr["TotalConsultedAmount"]);
            }

            return View("AppointmentAddEdit", model);
        }

        public IActionResult Search(string SearchData = "")
        {
            DataTable dt = new DataTable();

            try
            {
                string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
                SqlConnection connection = new SqlConnection(ConnetionString);

                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "PR_Appointment_Search_data";

                command.Parameters.Add("@searchData", SqlDbType.VarChar).Value = SearchData ?? "";

                SqlDataAdapter objAdapter = new SqlDataAdapter(command);
                objAdapter.Fill(dt);

                connection.Close();
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = ex.Message;
            }

            ViewBag.ProductName = SearchData;

         
            return View("AppointmentList", dt);
        }

        //[HttpPost]
        //[HttpPost]
        //public IActionResult AppointmentDeleteAll(List<int> selectedIds)
        //{
        //    Console.WriteLine("Selected IDs: " + string.Join(", ", selectedIds ?? new List<int>()));
        //    if (selectedIds != null && selectedIds.Any())
        //    {
        //        string query = $"DELETE FROM Appointment WHERE AppointmentID IN ({string.Join(",", selectedIds)})";

        //        using (SqlConnection conn = new SqlConnection("YourConnectionString"))
        //        {
        //            conn.Open();
        //            SqlCommand cmd = new SqlCommand(query, conn);
        //            cmd.ExecuteNonQuery();
        //        }
        //        TempData["Message"] = "Selected appointments deleted successfully.";
        //    }
        //    else
        //    {
        //        TempData["Message"] = "No appointments selected for deletion.";
        //    }

        //        return RedirectToAction("AppointmentList");
        //}

        [HttpPost]
        public IActionResult AppointmentDeleteAll(List<int> selectedIds)
        {
            if (selectedIds != null && selectedIds.Any())
            {
                string ids = string.Join(",", selectedIds);
                using (SqlConnection conn = new SqlConnection(configuration.GetConnectionString("DefaultConnection")))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand($"DELETE FROM Appointment WHERE AppointmentID IN ({ids})", conn);
                    cmd.ExecuteNonQuery();
                }
                TempData["Message"] = "Selected appointments deleted successfully.";
            }
            else
            {
                TempData["Message"] = "No appointments selected for deletion.";
            }

            return RedirectToAction("AppointmentList");
        }


        public IActionResult ExportToExcel()
            {
                //data ne hold krva mate table create kryu
                DataTable dt = new DataTable();

                // Fetch your data (replace with your actual DB logic)
                using (SqlConnection conn = new SqlConnection(configuration.GetConnectionString("DefaultConnection")))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("SELECT * FROM Appointment", conn);
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt); //database na data ne fill kryo
                }

                // Create Excel workbook
                using (var workbook = new XLWorkbook())
                {
                    dt.TableName = "Appointments"; //name of worksheet
                    var worksheet = workbook.Worksheets.Add(dt); // add data to worksheet

                    // Adjust column widths automatically
                    worksheet.Columns().AdjustToContents();

                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream); // workbook ne memory ma store kre
                        var content = stream.ToArray(); //memory ne byte array ma convert krse

                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "Appointments.xlsx"
                        );
                    }
                }
            }


}
}
