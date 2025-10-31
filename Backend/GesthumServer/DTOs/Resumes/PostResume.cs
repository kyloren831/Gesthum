using System.ComponentModel.DataAnnotations.Schema;

namespace GesthumServer.DTOs.Resumes
{
    public class PostResume
    {
        public int EmployeeId { get; set; }
        public string AcademicTraining { get; set; }
        public string Skills { get; set; }
        public string Languages { get; set; }
        public string ProfileSummary { get; set; }
        public List<PostWorkExpDTO>? WorkExpList { get; set; }
    }
}
