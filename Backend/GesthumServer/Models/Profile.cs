using System.ComponentModel.DataAnnotations.Schema;

namespace GesthumServer.Models
{
    public class Profile
    {
        public int Id { get; set; }
        [ForeignKey("EmployeeId")]
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; } 
        public string JobPosition { get; set; }
        public string Department { get; set; }
        public Employee Employee { get; set; }
    }
}
