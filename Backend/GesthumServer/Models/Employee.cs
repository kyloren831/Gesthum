using System.ComponentModel.DataAnnotations.Schema;

namespace GesthumServer.Models
{
    public class Employee
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public string Department { get; set; }
    }
}
