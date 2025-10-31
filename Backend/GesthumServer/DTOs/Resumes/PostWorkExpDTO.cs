using System.ComponentModel.DataAnnotations.Schema;

namespace GesthumServer.DTOs.Resumes
{
    public class PostWorkExpDTO
    {
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
