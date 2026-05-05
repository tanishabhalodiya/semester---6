using HospitalManagmentsystem.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HospitalManagmentsystem.Controllers
{
    [CheckAccess]
    public class PatientController : Controller
    {
        //taking connection string from configuration
        private IConfiguration configuration;
        public PatientController(IConfiguration _configuration)
        {
            configuration = _configuration;

        }
        public IActionResult PatientList()
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
            command.CommandText = "PR_Patient_Select_All";

            SqlDataReader reader = command.ExecuteReader();

            //cathing value in table 
            DataTable table = new DataTable();
            table.Load(reader);
            return View(table);
        }

        public IActionResult PatientDelete(int PatientID)
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
            command.CommandText = "PR_Patient_Delete";
            command.Parameters.Add("@PatientID", SqlDbType.Int).Value = PatientID;
            command.ExecuteNonQuery();
            return RedirectToAction("PatientList");
        }
        #region User Addedit
        public IActionResult PatientAddEdit(PatientModel patientModel)
        {
            ViewBag.UserList = getUserDropdown();
            if (ModelState.IsValid)
            {
                string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
                SqlConnection connection = new SqlConnection(ConnetionString);

                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                if (patientModel.PatientID == null || patientModel.PatientID == 0)
                {
                    command.CommandText = "PR_Patient_Insert";
                }
                else
                {
                    command.CommandText = "PR_Patient_Update";
                    command.Parameters.Add("@PatientId", SqlDbType.Int).Value = patientModel.PatientID;

                }
                command.Parameters.Add("@Name", SqlDbType.NVarChar).Value = patientModel.Name;
                command.Parameters.Add("@DateOfBirth", SqlDbType.DateTime).Value = patientModel.DateOfBirth;
                command.Parameters.Add("@Gender", SqlDbType.NVarChar).Value = patientModel.Gender;
                command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = patientModel.Email;
                command.Parameters.Add("@Phone", SqlDbType.NVarChar).Value = patientModel.Phone;
                command.Parameters.Add("@Address", SqlDbType.NVarChar).Value = patientModel.Address;
                command.Parameters.Add("@City", SqlDbType.NVarChar).Value = patientModel.City;
                command.Parameters.Add("@State", SqlDbType.NVarChar).Value = patientModel.State;
                command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = patientModel.IsActive;
                command.Parameters.Add("@UserId", SqlDbType.Int).Value = patientModel.UserID;

                command.ExecuteNonQuery();

                return RedirectToAction("PatientList");
            }
            return View(patientModel);
        }
        #endregion

        #region Fill data
        public IActionResult PatientFillData(int? PatientID)
        {
            ViewBag.UserList = getUserDropdown();
            if (PatientID == null || PatientID == 0)
            {
                PatientModel model1 = new PatientModel();
                return View("PatientAddEdit", model1);
            }

            string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
            SqlConnection connection = new SqlConnection(ConnetionString);

            connection.Open();

            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_Patient_Select_By";
            command.Parameters.Add("@PatientID", SqlDbType.Int).Value = PatientID;
            SqlDataReader reader = command.ExecuteReader();
            DataTable table = new DataTable();
            table.Load(reader);
            PatientModel model = new PatientModel();
            foreach (DataRow dr in table.Rows)
            {
                model.PatientID = Convert.ToInt32(dr["PatientID"].ToString());
                model.Name = dr["Name"].ToString();
                model.DateOfBirth = Convert.ToDateTime(dr["DateOfBirth"].ToString());
                model.Gender = dr["Gender"].ToString();
                model.Email = dr["Email"].ToString();
                model.Phone = dr["Phone"].ToString();
                model.Address = dr["Address"].ToString();
                model.City = dr["City"].ToString();
                model.State = dr["State"].ToString();
                model.IsActive = Convert.ToBoolean(dr["IsActive"]);
                model.UserID = Convert.ToInt32(dr["UserID"].ToString());
            }

            return View("PatientAddEdit", model);
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
    }
    #endregion
}
