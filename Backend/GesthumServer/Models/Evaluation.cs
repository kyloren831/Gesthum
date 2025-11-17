using System.ComponentModel.DataAnnotations.Schema;

namespace GesthumServer.Models
{
    public class Evaluation
    {
        public int Id { get; set; }
        [ForeignKey("ApplicationId")]
        public int ApplicationId { get; set; }
        public int Score { get; set; } // e.g., numerical score from 0 to 100
        public string Result { get; set; } // e.g., "Passed", "Failed", "Pending"
        public string Comments { get; set; }
        public string Strengths { get; set; }
        public string Weaknesses { get; set; }
        public string? Reasons { get; set; }
        public DateTime EvaluationDate { get; set; } = DateTime.Now;
        public Application Application { get; set; }
    }
}
