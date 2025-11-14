using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GesthumServer.Models
{
    public class Application
    {
        public int Id { get; set; }
        [ForeignKey("ResumeId")]
        public int ResumeId { get; set; }
        [ForeignKey("VacantId")]
        public int VacantId { get; set; }
        public DateTime ApplicationDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "Pending";
        public Resume Resume { get; set; }
        public Vacancy Vacant { get; set; }
    }
}
