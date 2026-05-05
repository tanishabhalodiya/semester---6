namespace Interview_Question_Generator.Models
{
    public class RegisterDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        // Optional — defaults to User
        public string Role { get; set; } = "User";
    }
}
