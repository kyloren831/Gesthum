using GesthumServer.DTOs.Applications;
using GesthumServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GesthumServer.Services
{
    public interface IApplicationsServices
    {
        Task<GetApplicationDTO> CreateApplication(PostApplicationDTO postApplicationDTO);
    }
    public class ApplicationsServices : IApplicationsServices
    {
        private readonly DbContextGesthum context;

        public ApplicationsServices(DbContextGesthum context)
        {
            this.context = context;
        }
        public async Task<GetApplicationDTO> CreateApplication(PostApplicationDTO postApplicationDTO)
        {
               var application = new Application 
               {
                   ResumeId = postApplicationDTO.ResumeId,
                   VacantId = postApplicationDTO.VacantId,
                   ApplicationDate = DateTime.Now,
                   Status = "Pending"
               };
                ValidateApplication(application);
                context.Applications.Add(application);
                await context.SaveChangesAsync();
                return new GetApplicationDTO
                {
                    Id = application.Id,
                    ResumeId = application.ResumeId,
                    VacantId = application.VacantId,
                    ApplicationDate = application.ApplicationDate,
                    Status = application.Status
                };
        }
        public async Task <GetApplicationDTO> GetApplicationByResumeId( int resumeId)
        {
            var application = await context.Applications.FirstOrDefaultAsync(x=>x.ResumeId == resumeId);
            if(application == null)
            {
                throw new InvalidOperationException("Application not found");
            }   
            return new GetApplicationDTO
            {
                Id = application.Id,
                ResumeId = application.ResumeId,
                VacantId = application.VacantId,
                ApplicationDate = application.ApplicationDate,
                Status = application.Status
            };
        }

        public async Task <List<GetApplicationDTO>> GetApplicationsByVacantId( int vacantId )
        {
            var applications = await context.Applications.Where(x=>x.VacantId == vacantId).ToListAsync();
            if(applications == null || applications.Count == 0)
            {
                throw new InvalidOperationException("No applications found for this vacancy");
            }   
            return applications.Select(application => new GetApplicationDTO
            {
                Id = application.Id,
                ResumeId = application.ResumeId,
                VacantId = application.VacantId,
                ApplicationDate = application.ApplicationDate,
                Status = application.Status
            }).ToList();
        }

        public async Task<List<GetApplicationDTO>> GetApplicationsByEmployeeId( int employeeId )
        {
            var applications = await context.Applications.Where(x=> x.Resume.EmployeeId == employeeId).ToListAsync();
            if(applications == null || applications.Count == 0)
            {
                throw new InvalidOperationException("No applications found for this employee");
            }
            return applications.Select(application => new GetApplicationDTO
            {
                Id = application.Id,
                ResumeId = application.ResumeId,
                VacantId = application.VacantId,
                ApplicationDate = application.ApplicationDate,
                Status = application.Status
            }).ToList();
        }

        public async Task<List<GetApplicationDTO>> GetAllApplications()
        {
            var applications = await context.Applications.ToListAsync();
            return applications.Select(application => new GetApplicationDTO
            {
                Id = application.Id,
                ResumeId = application.ResumeId,
                VacantId = application.VacantId,
                ApplicationDate = application.ApplicationDate,
                Status = application.Status
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
            var vacancy = context.Vacancies.FirstOrDefault(x => x.Id == application.VacantId);
            var resume = context.Resumes.FirstOrDefault(x => x.Id == application.ResumeId);
            if (vacancy == null || !vacancy.State)
            {
                throw new InvalidOperationException("Invalid vacancy");
            }
            if (resume == null)
            {
                throw new InvalidOperationException("Invalid resume");
            }

        }
    }
}
