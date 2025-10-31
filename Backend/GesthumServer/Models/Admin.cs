using System.ComponentModel.DataAnnotations.Schema;

namespace GesthumServer.Models
{
    public class Admin
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string? Photo { get; set; }
    }
}
