using System.ComponentModel.DataAnnotations.Schema;

namespace GesthumServer.DTOs.Applications
{
    public class GetApplicationDTO
    {
        public int Id { get; set; }
        public int ResumeId { get; set; }
        public int VacantId { get; set; }
        public DateTime ApplicationDate { get; set; } 
        public string Status { get; set; }
    }
}
