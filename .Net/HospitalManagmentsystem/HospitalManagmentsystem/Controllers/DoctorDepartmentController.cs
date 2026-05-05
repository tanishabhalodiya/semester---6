using HospitalManagmentsystem.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.SqlClient;

namespace HospitalManagmentsystem.Controllers
{
    [CheckAccess]
    public class DoctorDepartmentController : Controller
    {
        //taking connection string from configuration
        private IConfiguration configuration;
        public DoctorDepartmentController(IConfiguration _configuration)
        {
            configuration = _configuration;

        }

        public IActionResult DoctorDepartmentList()
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
            command.CommandText = "PR_DoctorDepartment_Select_All";

            SqlDataReader reader = command.ExecuteReader();

            //cathing value in table 
            DataTable table = new DataTable();
            table.Load(reader);
            return View(table);
        }

        public IActionResult DoctorDepartmentDelete(int DoctorDepartmentID)
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
            command.CommandText = "PR_DoctorDepartment_DELETE";
            command.Parameters.Add("@DoctorDepartmentId", SqlDbType.Int).Value = DoctorDepartmentID;
            command.ExecuteNonQuery();
            return RedirectToAction("DoctorDepartmentList");
        }
        public IActionResult DoctorDepartmentAddEdit(DoctorDepartmentModel doctorDepartmentModel)
        {
        
            ViewBag.UserList = getUserDropdown();
            ViewBag.DoctorList = getDoctorDropdown();
            ViewBag.DepartmentList = getDepartmentDropdown();

            if (ModelState.IsValid)
            {
                string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
                SqlConnection connection = new SqlConnection(ConnetionString);

                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                if (doctorDepartmentModel.DoctorDepartmentID == 0 || doctorDepartmentModel.DoctorDepartmentID == null)
                {
                    command.CommandText = "PR_DoctorDepartment_Insert"; 
                }
                else
                {
                    command.CommandText = "PR_DoctorDepartment_Update";
                    command.Parameters.Add("@DoctorDepartmentId", SqlDbType.Int).Value = doctorDepartmentModel.DoctorDepartmentID;

                }
                command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = doctorDepartmentModel.DoctorID;
                command.Parameters.Add("@DepartmentID", SqlDbType.Int).Value = doctorDepartmentModel.DepartmentID;
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = doctorDepartmentModel.UserID;

                command.ExecuteNonQuery();

                return RedirectToAction("DoctorDepartmentList");
            }
            return View(doctorDepartmentModel);
        }

        public IActionResult DoctorDepartmentFillData(int? DoctorDepartmentID)
        {
            ViewBag.UserList = getUserDropdown();
            ViewBag.DoctorList = getDoctorDropdown();
            ViewBag.DepartmentList = getDepartmentDropdown();

            if (DoctorDepartmentID == null || DoctorDepartmentID == 0)
            {
                DoctorDepartmentModel model1 = new DoctorDepartmentModel();
                return View("DoctorDepartmentAddEdit", model1);
            }

            string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
            SqlConnection connection = new SqlConnection(ConnetionString);

            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_DoctorDepartment_Select_By";
            command.Parameters.Add("@DoctorDepartmentId", SqlDbType.Int).Value = DoctorDepartmentID;
            SqlDataReader reader = command.ExecuteReader();
            DataTable table = new DataTable();
            table.Load(reader);
            DoctorDepartmentModel model = new DoctorDepartmentModel();
            foreach (DataRow dr in table.Rows)
            {
                model.DoctorID = Convert.ToInt32(dr["DoctorID"]);
                model.DepartmentID = Convert.ToInt32(dr["DepartmentID"]);
                model.UserID = Convert.ToInt32(dr["UserID"]);

            }
            return View("DoctorDepartmentAddEdit", model);
        }

        public List<UserDropDownModel> getUserDropdown()
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
                UserDropDownModel model = new UserDropDownModel();
                model.UserID = Convert.ToInt32(data["UserID"]);
                model.UserName = data["UserName"].ToString();
                userList.Add(model);
            }
            connection.Close();
            return userList;
        }

        public List<DoctorDropDownModel> getDoctorDropdown()
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
                DoctorDropDownModel model = new DoctorDropDownModel();
                model.DoctorID = Convert.ToInt32(data["DoctorID"]);
                model.DoctorName = data["Name"].ToString();
                doctorList.Add(model);
            }
            connection.Close();
            return doctorList;
        }

        public List<DepartmentDropDownModel> getDepartmentDropdown()
        {
            string connectionString = this.configuration.GetConnectionString("DefaultConnection");
            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Department_SelectForDropDown";

            SqlDataReader reader = command.ExecuteReader();
            DataTable dataTable = new DataTable();
            dataTable.Load(reader);

            List<DepartmentDropDownModel> departmentList = new List<DepartmentDropDownModel>();
            foreach (DataRow data in dataTable.Rows)
            {
                DepartmentDropDownModel model = new DepartmentDropDownModel();
                model.DepartmentID = Convert.ToInt32(data["DepartmentID"]);
                model.DepartmentName = data["DepartmentName"].ToString(); // FIXED
                departmentList.Add(model);
            }
            return departmentList;
        }

    }
}


//ExecuteReader() : cathing data , readonly
//ExecuteNonQuery() : when you get int value in return (insert , update)
//ExecuteScalar() : return object of first col of first row in first result set(max ,min , avg)