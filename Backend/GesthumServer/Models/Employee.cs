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
        public string? PhotoUrl { get; set; }

        // Cambiado a colección para permitir múltiples Resumes por Employee
        public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
    }
}
