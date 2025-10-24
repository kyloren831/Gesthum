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
        Task<Vacancy> GetVacantById(int id);
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
        public async Task<Vacancy> GetVacantById(int id)
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
            dbContext.Vacancies.Add(nvacant);
            await dbContext.SaveChangesAsync();
            return nvacant;
        }
        public async Task<bool> ChangeStatus(int id)
        {
            var vacant = await dbContext.Vacancies.FindAsync(id);
            if (vacant == null)
            {
                throw new KeyNotFoundException("Vacancy not found");
            }
            vacant.State = !vacant.State;
            await dbContext.SaveChangesAsync();
            return true;
        }
        public async Task<Vacancy> UpdateVacancy(int id, PutVacancy updatedVacant)
        {
            var vacant = await dbContext.Vacancies.FindAsync(id);
            if (vacant == null)
            {
                throw new KeyNotFoundException("Vacancy not found");
            }
            vacant.Title = updatedVacant.Title;
            vacant.Description = updatedVacant.Description;
            vacant.Requirements = updatedVacant.Requirements;
            vacant.Location = updatedVacant.Location;
            vacant.CloseDate = updatedVacant.CloseDate;
            await dbContext.SaveChangesAsync();
            return vacant;
        }
    }
}
