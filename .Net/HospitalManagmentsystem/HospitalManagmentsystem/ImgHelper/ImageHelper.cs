namespace HospitalManagmentsystem.ImgHelper
{
    //public static class ImageHelper
    //{
    //    public static string SaveImage(IFormFile file, string folderName)
    //    {
    //        string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);
    //        if (!Directory.Exists(folderPath))
    //            Directory.CreateDirectory(folderPath);

    //        string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
    //        string filePath = Path.Combine(folderPath, fileName);

    //        using (var stream = new FileStream(filePath, FileMode.Create))
    //        {
    //            file.CopyTo(stream);
    //        }

    //        return "/uploads/" + folderName + "/" + fileName; // return relative path for DB
    //    }


    //    public static void DeleteFileFromUrl(string filePath)
    //    {
    //        if (!string.IsNullOrEmpty(filePath))
    //        {
    //            string fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath.TrimStart('/'));
    //            if (File.Exists(fullPath))
    //            {
    //                File.Delete(fullPath);
    //            }
    //        }
    //    }
    //}
    public static class ImageHelper
    {
        public static string SaveImage(IFormFile file, string folderName)
        {
            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }

            return $"/uploads/{folderName}/{uniqueFileName}";
        }

        public static void DeleteFileFromUrl(string fileUrl)
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", fileUrl.TrimStart('/'));
            if (File.Exists(filePath))
                File.Delete(filePath);
        }
    }


}
