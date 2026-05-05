using HospitalManagmentsystem.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HospitalManagmentsystem.Controllers
{
    [CheckAccess]
    public class DepartmentController : Controller
    {
        //taking connection string from configuration
        private IConfiguration configuration;
        public DepartmentController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }
        public IActionResult DepartmentList()
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
            command.CommandText = "PR_Department_Select_All";

            SqlDataReader reader = command.ExecuteReader();

            //cathing value in table 
            DataTable table = new DataTable();
            table.Load(reader);
            return View(table);
            }
        public IActionResult DepartmentDelete(int DepartmentID)
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
            command.CommandText = "PR_Department_Delete";
            command.Parameters.Add("@deptId", SqlDbType.Int).Value = DepartmentID;
            command.ExecuteNonQuery();
            return RedirectToAction("DepartmentList");
        }

        #region Department Addedit

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
        public IActionResult DepartmentAddEdit(DepartmentModel departmentModel)
        {
            ViewBag.UserList = getUserDropdown();
            if (ModelState.IsValid)
            {
                string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
                SqlConnection connection = new SqlConnection(ConnetionString);

                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                if (departmentModel.DepartmentID == 0 || departmentModel.DepartmentID == null)
                {
                    command.CommandText = "PR_Department_Insert";
                }
                else
                {
                    command.CommandText = "PR_Department_Update";
                    command.Parameters.Add("@deptId", SqlDbType.Int).Value = departmentModel.DepartmentID;

                }
                command.Parameters.Add("@deptName", SqlDbType.NVarChar).Value = departmentModel.DepartmentName;
                command.Parameters.Add("@desc", SqlDbType.NVarChar).Value = departmentModel.Description;
                command.Parameters.Add("@isActive", SqlDbType.Bit).Value = departmentModel.IsActive;
                command.Parameters.Add("@userId", SqlDbType.Int).Value = departmentModel.UserID;

                command.ExecuteNonQuery();

                return RedirectToAction("DepartmentList");
            }
            return View(departmentModel);
        }
        #endregion

        #region Fill data
        public IActionResult DepartmentFillData(int? DepartmentID)
        {
            ViewBag.UserList = getUserDropdown();
            if (DepartmentID == null || DepartmentID == 0)
            {
                DepartmentModel model1 = new DepartmentModel();
                return View("DepartmentAddEdit", model1);
            }

            string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
            SqlConnection connection = new SqlConnection(ConnetionString);

            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Department_Select_By";
            command.Parameters.Add("@deptId", SqlDbType.Int).Value = DepartmentID;
            SqlDataReader reader = command.ExecuteReader();
            DataTable table = new DataTable();
            table.Load(reader);
            DepartmentModel model = new DepartmentModel();
            foreach (DataRow dr in table.Rows)
            {
                model.DepartmentID = Convert.ToInt32(dr["DepartmentID"]);
                model.DepartmentName = dr["DepartmentName"].ToString();
                model.Description = dr["Description"].ToString();
                model.IsActive = Convert.ToBoolean(dr["IsActive"]);
                model.UserID = Convert.ToInt32(dr["UserID"].ToString());

            }
            return View("DepartmentAddEdit", model);
        }
        #endregion
        
    }
}
