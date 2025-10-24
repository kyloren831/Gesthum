using System.ComponentModel.DataAnnotations.Schema;

namespace GesthumServer.Models
{
    public class WorkExperience
    {
        public int Id { get; set; }
        [ForeignKey("ResumeId")]
        public int ResumeId { get; set; }
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }


        public Resume Resume { get; set; }
    }
}
