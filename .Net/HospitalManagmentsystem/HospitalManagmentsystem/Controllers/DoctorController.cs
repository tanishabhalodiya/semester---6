    using HospitalManagmentsystem.ImgHelper;
    using HospitalManagmentsystem.Models;
    using Microsoft.AspNetCore.Mvc;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data;
    using System.Data.SqlClient;

    namespace HospitalManagmentsystem.Controllers
    {
        [CheckAccess]
        public class DoctorController : Controller
        {
            //taking connection string from configuration
            private IConfiguration configuration;
            public DoctorController(IConfiguration _configuration)
            {
                configuration = _configuration;

            }

            public IActionResult DoctorList()
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
                command.CommandText = "PR_Doctor_Select_All";

                SqlDataReader reader = command.ExecuteReader();

                //cathing value in table 
                DataTable table = new DataTable();
                table.Load(reader);
                return View(table);
            }

            
            public IActionResult DoctorDelete(int DoctorID)
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
                command.CommandText = "PR_Doctor_Delete";
                command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = DoctorID;
                command.ExecuteNonQuery();
                return RedirectToAction("DoctorList");
            }

        #region User Addedit
        [HttpPost]
        public IActionResult DoctorAddEdit(DoctorModel doctorModel)
        {
            ViewBag.UserList = getUserDropdown();

            if (ModelState.IsValid)
            {
                string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
                SqlConnection connection = new SqlConnection(ConnetionString);

                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                if (doctorModel.DoctorID == 0 || doctorModel.DoctorID == null)
                {
                    command.CommandText = "PR_Doctor_Insert";
                }
                else
                {
                    command.CommandText = "PR_Doctor_Update";
                    command.Parameters.Add("@DoctorId", SqlDbType.Int).Value = doctorModel.DoctorID;

                }
                command.Parameters.Add("@Name", SqlDbType.NVarChar).Value = doctorModel.Name;
                command.Parameters.Add("@Phone", SqlDbType.NVarChar).Value = doctorModel.Phone;
                command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = doctorModel.Email;
                command.Parameters.Add("@Qualification", SqlDbType.NVarChar).Value = doctorModel.Qualification;
                command.Parameters.Add("@Specialization", SqlDbType.NVarChar).Value = doctorModel.Specialization;
                command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = doctorModel.IsActive;
                command.Parameters.Add("@UserID", SqlDbType.Int).Value = doctorModel.UserID;

                command.ExecuteNonQuery();

                return RedirectToAction("DoctorList");
            }
            return View(doctorModel);
        }
        [HttpPost]
        //public IActionResult DoctorAddEdit(DoctorModel doctorModel)
        //{
        //    ViewBag.UserList = getUserDropdown();

        //    if (ModelState.IsValid)
        //    {
        //        string connectionString = configuration.GetConnectionString("DefaultConnection");

        //        // ✅ Handle image upload
        //        if (doctorModel.ProfileImg != null && doctorModel.ProfileImg.Length > 0)
        //        {
        //            if (!string.IsNullOrEmpty(doctorModel.ProfileImgSrc))
        //            {
        //                ImageHelper.DeleteFileFromUrl(doctorModel.ProfileImgSrc);
        //            }

        //            // ✅ Save image in wwwroot and return full relative path
        //            doctorModel.ProfileImgSrc = ImageHelper.SaveImage(doctorModel.ProfileImg, "DoctorProfile");
        //        }

        //        using (SqlConnection connection = new SqlConnection(connectionString))
        //        {
        //            connection.Open();
        //            SqlCommand command = connection.CreateCommand();
        //            command.CommandType = CommandType.StoredProcedure;

        //            if (doctorModel.DoctorID == null || doctorModel.DoctorID == 0)
        //            {
        //                command.CommandText = "PR_Doctor_Insert";
        //            }
        //            else
        //            {
        //                command.CommandText = "PR_Doctor_Update";
        //                command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = doctorModel.DoctorID;
        //            }

        //            command.Parameters.Add("@Name", SqlDbType.NVarChar).Value = doctorModel.Name;
        //            command.Parameters.Add("@Phone", SqlDbType.NVarChar).Value = doctorModel.Phone;
        //            command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = doctorModel.Email;
        //            command.Parameters.Add("@Qualification", SqlDbType.NVarChar).Value = doctorModel.Qualification;
        //            command.Parameters.Add("@Specialization", SqlDbType.NVarChar).Value = doctorModel.Specialization;
        //            command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = doctorModel.IsActive;
        //            command.Parameters.Add("@UserID", SqlDbType.Int).Value = doctorModel.UserID;
        //            command.Parameters.Add("@ProfileImgSrc", SqlDbType.NVarChar).Value =
        //                string.IsNullOrEmpty(doctorModel.ProfileImgSrc) ? (object)DBNull.Value : doctorModel.ProfileImgSrc;

        //            command.ExecuteNonQuery();
        //        }

        //        // ✅ Stay on the same page with updated model so image remains
        //        ViewBag.Success = "Doctor details saved successfully!";
        //        return View("DoctorList", doctorModel);
        //    }

        //    return View(doctorModel);
        //}



        #endregion

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



            #region Fill data
            public IActionResult DoctorFillData(int? DoctorID)
            {
                ViewBag.UserList = getUserDropdown();

                if (DoctorID == null || DoctorID == 0)
                {
                    DoctorModel model1 = new DoctorModel();
                    return View("DoctorAddEdit", model1);
                }

                string ConnetionString = this.configuration.GetConnectionString(name: "DefaultConnection");
                SqlConnection connection = new SqlConnection(ConnetionString);

                connection.Open();

                SqlCommand command = connection.CreateCommand();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "PR_Doctor_Select_By";
                command.Parameters.Add("@DoctorID", SqlDbType.Int).Value = DoctorID;
                SqlDataReader reader = command.ExecuteReader();
                DataTable table = new DataTable();
                table.Load(reader);
                DoctorModel model = new DoctorModel();  
                foreach (DataRow dr in table.Rows)
                {
                    model.DoctorID = Convert.ToInt32(dr["DoctorID"]);
                    model.Name = dr["Name"].ToString();
                    model.Phone = dr["Phone"].ToString();
                    model.Email = dr["Email"].ToString();
                    model.Qualification = dr["Qualification"].ToString();
                    model.Specialization = dr["Specialization"].ToString();
                    model.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    model.Modified = Convert.ToDateTime(dr["Modified"]);
                    model.UserID = Convert.ToInt32(dr["UserID"].ToString());

                }

                return View("DoctorAddEdit", model);
            }
            #endregion


        }

    }


    //ExecuteReader() : cathing data , readonly
    //ExecuteNonQuery() : when you get int value in return (insert , update)
    //ExecuteScalar() : return object of first col of first row in first result set(max ,min , avg)