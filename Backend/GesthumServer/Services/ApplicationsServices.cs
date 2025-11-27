using GesthumServer.DTOs.Applications;
using GesthumServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GesthumServer.Services
{
    public interface IApplicationsServices
    {
        Task<Application> GetApplicationById(int applicationId);
        Task<GetApplicationDTO> CreateApplication(PostApplicationDTO postApplicationDTO);
        Task DeleteApplication(int applicationId);
        Task<List<GetApplicationDTO>> GetAllApplications();
        Task<List<GetApplicationDTO>> GetApplicationsByEmployeeId(int employeeId);
        Task<List<GetApplicationDTO>> GetApplicationsByVacantId(int vacantId);
        void ValidateApplication(Application application);
    }

    public class ApplicationsServices : IApplicationsServices
    {
        private readonly DbContextGesthum context;
        private readonly IResumesServices resumesServices;

        public ApplicationsServices(DbContextGesthum context, IResumesServices resumesServices)
        {
            this.context = context;
            this.resumesServices = resumesServices;
        }

        public async Task<Application> GetApplicationById(int applicationId)
        {
            // Traer Application junto con Resume (y sus WorkExperience) y Vacant en modo AsNoTracking
            var application = await context.Applications
                .AsNoTracking()
                .Include(a => a.Resume)
                    .ThenInclude(r => r.WorkExperience)
                .Include(a => a.Vacant)
                .FirstOrDefaultAsync(x => x.Id == applicationId);

            if (application == null)
            {
                throw new KeyNotFoundException("Application not found");
            }

            // Romper referencias que puedan producir ciclos al serializar (por ejemplo Resume -> Employee o WorkExperience -> Resume)
            if (application.Resume != null)
            {
                application.Resume.Employee = null;

                if (application.Resume.WorkExperience != null)
                {
                    foreach (var we in application.Resume.WorkExperience)
                    {
                        we.Resume = null;
                    }
                }
            }

            return application;
        }

        public async Task<GetApplicationDTO> CreateApplication(PostApplicationDTO postApplicationDTO)
        {
            // Obtener el resume activo del empleado usando ResumesServices
            var resume = await resumesServices.GetResumeByEmployeeId(postApplicationDTO.EmployeeId);

            var application = new Application
            {
                ResumeId = resume.Id,
                VacantId = postApplicationDTO.VacantId,
                ApplicationDate = DateTime.UtcNow,
                Status = "Pending"
            };

            ValidateApplication(application);
            context.Applications.Add(application);
            await context.SaveChangesAsync();

            // Obtener datos de la vacante para incluir en el DTO
            var vacancy = await context.Vacancies.AsNoTracking().FirstOrDefaultAsync(x => x.Id == application.VacantId);

            return new GetApplicationDTO
            {
                Id = application.Id,
                ResumeId = application.ResumeId,
                VacantId = application.VacantId,
                ApplicationDate = application.ApplicationDate,
                Status = application.Status,
                VacantTitle = vacancy?.Title ?? string.Empty,
                VacantLocation = vacancy?.Location ?? string.Empty,
                VacantPostedDate = vacancy?.PostedDate ?? default,
                VacantCloseDate = vacancy?.CloseDate ?? default,
                VacantState = vacancy != null && vacancy.State
            };
        }

       
        public async Task<List<GetApplicationDTO>> GetApplicationsByVacantId(int vacantId)
        {
            var applications = await context.Applications
                .Include(a => a.Vacant)
                .Where(x => x.VacantId == vacantId)
                .ToListAsync();
            if (applications == null || applications.Count == 0)
            {
                throw new InvalidOperationException("No applications found for this vacancy");
            }
            return applications.Select(application => new GetApplicationDTO
            {
                Id = application.Id,
                ResumeId = application.ResumeId,
                VacantId = application.VacantId,
                ApplicationDate = application.ApplicationDate,
                Status = application.Status,
                VacantTitle = application.Vacant?.Title ?? string.Empty,
                VacantLocation = application.Vacant?.Location ?? string.Empty,
                VacantPostedDate = application.Vacant?.PostedDate ?? default,
                VacantCloseDate = application.Vacant?.CloseDate ?? default,
                VacantState = application.Vacant != null && application.Vacant.State
            }).ToList();
        }

        public async Task<List<GetApplicationDTO>> GetApplicationsByEmployeeId(int employeeId)
        {
            // Incluir Resume y Vacant para poder filtrar por Resume.EmployeeId y devolver datos de la vacante
            var applications = await context.Applications
                .Include(a => a.Resume)
                .Include(a => a.Vacant)
                .Where(x => x.Resume != null && x.Resume.EmployeeId == employeeId)
                .ToListAsync();

            if (applications == null || applications.Count == 0)
            {
                throw new InvalidOperationException("No applications found for this employee");
            }
            return applications.Select(application => new GetApplicationDTO
            {
                Id = application.Id,
                ResumeId = application.ResumeId, // Para abrir el resume desde el application
                VacantId = application.VacantId, // Para abrir la vacant desde el application
                ApplicationDate = application.ApplicationDate,
                Status = application.Status,
                VacantTitle = application.Vacant?.Title ?? string.Empty,
                VacantLocation = application.Vacant?.Location ?? string.Empty,
                VacantPostedDate = application.Vacant?.PostedDate ?? default,
                VacantCloseDate = application.Vacant?.CloseDate ?? default,
                VacantState = application.Vacant != null && application.Vacant.State
            }).ToList();
        }

        public async Task<List<GetApplicationDTO>> GetAllApplications()
        {
            var applications = await context.Applications
                .Include(a => a.Vacant)
                .ToListAsync();
            return applications.Select(application => new GetApplicationDTO
            {
                Id = application.Id,
                ResumeId = application.ResumeId,
                VacantId = application.VacantId,
                ApplicationDate = application.ApplicationDate,
                Status = application.Status,
                VacantTitle = application.Vacant?.Title ?? string.Empty,
                VacantLocation = application.Vacant?.Location ?? string.Empty,
                VacantPostedDate = application.Vacant?.PostedDate ?? default,
                VacantCloseDate = application.Vacant?.CloseDate ?? default,
                VacantState = application.Vacant != null && application.Vacant.State
            }).ToList();
        }

        public async Task DeleteApplication(int applicationId)
        {
            var application = await context.Applications.FirstOrDefaultAsync(x => x.Id == applicationId);
            if (application == null)
            {
                throw new InvalidOperationException("Application not found");
            }
            context.Applications.Remove(application);
            await context.SaveChangesAsync();
        }

        public void ValidateApplication(Application application)
        {
            var vacancy = context.Vacancies.AsNoTracking().FirstOrDefault(x => x.Id == application.VacantId);
            var resume = context.Resumes.AsNoTracking().FirstOrDefault(x => x.Id == application.ResumeId);
            var applicationsExist = context.Applications.AsNoTracking().Any(x => x.ResumeId == application.ResumeId && x.VacantId == application.VacantId);
            if (vacancy == null || !vacancy.State)
            {
                throw new InvalidOperationException("Invalid vacancy");
            }
            if (resume == null)
            {
                throw new InvalidOperationException("Invalid resume");
            }
            if (applicationsExist)
            {
                throw new InvalidOperationException(
                    "An application with this resume for the specified vacancy already exists");
            }
        }
    }
}