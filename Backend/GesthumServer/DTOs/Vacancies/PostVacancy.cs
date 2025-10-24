namespace GesthumServer.DTOs.Vacancies
{
    public class PostVacancy
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public string Location { get; set; }
        public DateTime PostedDate { get; set; } = DateTime.Now;
        public DateTime CloseDate { get; set; }
        public bool State { get; set; }
    }
}
