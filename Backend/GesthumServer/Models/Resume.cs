using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GesthumServer.Models
{
    public class Resume
    {
        public int Id { get; set; }
        [ForeignKey("EmployeeId")]
        public int EmployeeId { get; set; }
        public DateTime CreationDate { get; set; }
        public string AcademicTraining { get; set; }
        public string Skills { get; set; }
        public string Languages { get; set; }
        public string ProfileSummary { get; set; }
        [JsonIgnore]
        public Employee Employee { get; set; }
        public IEnumerable<WorkExperience>? WorkExperience { get; set; }
    }
}
