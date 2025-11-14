using GesthumServer.DTOs.Vacancies;
using GesthumServer.Models;

namespace GesthumServer.Services
{
    public interface IVacanciesServices
    {
        Task<bool> ChangeStatus(int id);
        Task<Vacancy> CreateVacancy(PostVacancy vacant);
        IEnumerable<Vacancy> GetAllVacancies();
        Task<Vacancy> GetVacancyById(int id);
        Task<Vacancy> UpdateVacancy(int id, PutVacancy updatedVacant);
    }

    public class VacanciesServices : IVacanciesServices
    {
        private readonly DbContextGesthum dbContext;

        // Vacancy service methods would go here
        public VacanciesServices(DbContextGesthum dbContext)
        {
            this.dbContext = dbContext;
        }

        public IEnumerable<Vacancy> GetAllVacancies()
        {
            var vacancies = dbContext.Vacancies.ToList();
            if (vacancies == null || !vacancies.Any())
            {
                throw new KeyNotFoundException("No vacancies found");
            }
            return vacancies;
        }
        public async Task<Vacancy> GetVacancyById(int id)
        {
            var vacant = await dbContext.Vacancies.FindAsync(id);
            if (vacant == null)
            {
                throw new KeyNotFoundException("Vacancy not found");
            }
            return vacant;
        }
        public async Task<Vacancy> CreateVacancy(PostVacancy vacant)
        {
            var nvacant = new Vacancy
            {
                Title = vacant.Title,
                Description = vacant.Description,
                Requirements = vacant.Requirements,
                Location = vacant.Location,
                PostedDate = vacant.PostedDate,
                CloseDate = vacant.CloseDate,
                State = vacant.State
            };
            ValidateVacancy(nvacant);
            dbContext.Vacancies.Add(nvacant);
            await dbContext.SaveChangesAsync();
            return nvacant;
        }
        public async Task<bool> ChangeStatus(int id)
        {
            var vacancy = await dbContext.Vacancies.FindAsync(id);
            if (vacancy == null)
            {
                throw new KeyNotFoundException("Vacancy not found");
            }
            vacancy.State = !vacancy.State;
            await dbContext.SaveChangesAsync();
            return true;
        }
        public async Task<Vacancy> UpdateVacancy(int id, PutVacancy updatedVacant)
        {
            var vacancy = await dbContext.Vacancies.FindAsync(id);
            if (vacancy == null)
            {
                throw new KeyNotFoundException("Vacancy not found");
            }
            vacancy.Title = updatedVacant.Title;
            vacancy.Description = updatedVacant.Description;
            vacancy.Requirements = updatedVacant.Requirements;
            vacancy.Location = updatedVacant.Location;
            vacancy.CloseDate = updatedVacant.CloseDate;
            ValidateVacancy(vacancy);
            await dbContext.SaveChangesAsync();
            return vacancy;
        }
        
        public void ValidateVacancy(Vacancy vacant)
        {
            switch (vacant)
            {
                case null:
                    throw new ArgumentException("Vacancy data is required");

                case { Title: var title } when string.IsNullOrWhiteSpace(title):
                    throw new ArgumentException("Vacancy title cannot be empty");

                case { Description: var desc } when string.IsNullOrWhiteSpace(desc):
                    throw new ArgumentException("Vacancy description cannot be empty");

                case { Requirements: var req } when string.IsNullOrWhiteSpace(req):
                    throw new ArgumentException("Vacancy requirements cannot be empty");

                case { Location: var loc } when string.IsNullOrWhiteSpace(loc):
                    throw new ArgumentException("Vacancy location cannot be empty");

                case { PostedDate: var posted, CloseDate: var close } when posted >= close:
                    throw new ArgumentException("Posted date must be before close date");

                case { CloseDate: var closeDate } when closeDate < DateTime.Today:
                    throw new ArgumentException("Close date cannot be in the past");
            }
        }
    }
}
