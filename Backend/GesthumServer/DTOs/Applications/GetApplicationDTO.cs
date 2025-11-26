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

        // Vacant data
        public string VacantTitle { get; set; }
        public string VacantLocation { get; set; }
        public DateTime VacantPostedDate { get; set; }
        public DateTime VacantCloseDate { get; set; }
        public bool VacantState { get; set; }
    }
}
