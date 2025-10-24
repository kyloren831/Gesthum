namespace GesthumSecurity.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string JobPosition { get; set; }
        public string Department { get; set; }
        public bool IsAdmin { get; set; }
    }
}
