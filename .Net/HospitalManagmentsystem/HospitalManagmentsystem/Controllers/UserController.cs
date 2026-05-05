using HospitalManagmentsystem.Helper;
using HospitalManagmentsystem.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace HospitalManagmentsystem.wwwroot.assets.Controllers
{
    public class UserController : Controller
    {
        #region Configuration
        //taking connection string from configuration
        private IConfiguration configuration;
        

        public UserController(IConfiguration _configuration)
        {
            configuration = _configuration;

        }
        #endregion

       

        #region Get All User
        public IActionResult UserList(string searchData)
        {
            string connectionString = this.configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                SqlCommand command = new SqlCommand("PR_User_SelectAll", connection);
                command.CommandType = CommandType.StoredProcedure;

                // Pass parameter
                if (string.IsNullOrEmpty(searchData))
                    command.Parameters.AddWithValue("@SearchData", DBNull.Value);
                else
                    command.Parameters.AddWithValue("@SearchData", searchData);

                SqlDataAdapter da = new SqlDataAdapter(command);
                DataTable dt = new DataTable();
                da.Fill(dt);

                return View(dt);
            }
        }
        #endregion

        #region User delete
        public IActionResult UserDelete(string UserID)
        {

            int decryptedProductID = Convert.ToInt32(UrlEncryptor.Decrypt(UserID));
            //DB connectivity
            string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
            //need to give connectionstring to sql class
            SqlConnection connection = new SqlConnection(ConnetionString);

            //we open database 
            connection.Open();

            //we write command
            SqlCommand command = connection.CreateCommand();
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = "PR_User_Delete";
            command.Parameters.Add("@UserID", SqlDbType.Int).Value = decryptedProductID;
            command.ExecuteNonQuery();
             TempData["Message"]= "Data Deleted Succesfully";

            return RedirectToAction("UserList");
            //ViewBag.Message = "Data Deleted Succesfully"; 
        }
        #endregion


        #region User Addedit
        public IActionResult UserAddEdit(UserModel userModel)
        {

            if (ModelState.IsValid)
            {
                string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
                SqlConnection connection = new SqlConnection(ConnetionString);

                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                if (userModel.UserID ==null || userModel.UserID == 0)
                {
                    command.CommandText = "PR_User_Insert";
                }
                else
                {
                    command.CommandText = "PR_User_Update";
                    command.Parameters.Add("@UserID", SqlDbType.Int).Value = userModel.UserID;

                }
                command.Parameters.Add("@UserName", SqlDbType.NVarChar).Value = userModel.UserName;
                command.Parameters.Add("@Password", SqlDbType.NVarChar).Value = userModel.Password;
                command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = userModel.Email;
                command.Parameters.Add("@MobileNo", SqlDbType.NVarChar).Value = userModel.MobileNo;
                command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = userModel.IsActive;

                command.ExecuteNonQuery();

                return RedirectToAction("UserList");
            }
            return View(userModel);
        }
        #endregion

        #region Fill data
        public IActionResult UserFillData(string? DecUserID)
        {
            if (string.IsNullOrEmpty(DecUserID))
            {
                // Add mode: No ID provided, show empty form
                return View("UserAddEdit", new UserModel());
            }

            // Edit mode: Decrypt and load data
            int decryptedUserID = Convert.ToInt32(UrlEncryptor.Decrypt(DecUserID));

            string connectionString = this.configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "PR_User_Select_by_pk";
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = decryptedUserID;

                SqlDataReader reader = command.ExecuteReader();
                DataTable table = new DataTable();
                table.Load(reader);

                UserModel model = new UserModel();
                foreach (DataRow dr in table.Rows)
                {
                    model.UserID = Convert.ToInt32(dr["UserID"]);
                    model.UserName = dr["UserName"].ToString();
                    model.Password = dr["Password"].ToString();
                    model.Email = dr["Email"].ToString();
                    model.MobileNo = dr["MobileNo"].ToString();
                    model.IsActive = Convert.ToBoolean(dr["IsActive"]);
                }

                return View("UserAddEdit", model);
            }
        }

        #endregion



        public IActionResult UserLogin(UserLoginModel userLoginModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    string connectionString = this.configuration.GetConnectionString("DefaultConnection");
                    SqlConnection sqlConnection = new SqlConnection(connectionString);
                    sqlConnection.Open();
                    SqlCommand sqlCommand = sqlConnection.CreateCommand();
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    sqlCommand.CommandText = "PR_User_Login";
                    sqlCommand.Parameters.Add("@UserName", SqlDbType.VarChar).Value = userLoginModel.UserName;
                    sqlCommand.Parameters.Add("@Password", SqlDbType.VarChar).Value = userLoginModel.Password;
                    SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
                    DataTable dataTable = new DataTable();
                    dataTable.Load(sqlDataReader);
                    if (dataTable.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dataTable.Rows)
                        {
                            HttpContext.Session.SetString("UserID", dr["UserID"].ToString());
                            HttpContext.Session.SetString("UserName", dr["UserName"].ToString());
                        }

                        return RedirectToAction("Index", "Dashboard");
                    }
                    else
                    {
                        return RedirectToAction("Login", "User");
                    }

                }
            }
            catch (Exception e)
            {
                TempData["ErrorMessage"] = e.Message;
            }

            return RedirectToAction("Login");
        }


        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "User");
        }

        public IActionResult Login()
        {
            return View();
        }

    }
}

