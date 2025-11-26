namespace GesthumServer.DTOs.Vacancies
{
    public class PutVacancy
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public string Location { get; set; }
        public DateTime CloseDate { get; set; }
        public bool State { get; set; }
    }
}
