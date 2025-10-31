﻿using GesthumServer.DTOs.Resumes;
using GesthumServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GesthumServer.Services
{
    public interface IResumesServices
    {
        Task<Resume> CreateResume(PostResume resume);
        Task DeleteResumeByEmployeeId(int id);
        Task<Resume> GetResumeByEmployeeId(int id);
        Task<Resume> UpdateResume(int id, PostResume updatedResume);
    }

    public class ResumesServices : IResumesServices
    {
        private readonly DbContextGesthum context;

        public ResumesServices(DbContextGesthum context)
        {
            this.context = context;
        }

        /// <summary>
        /// Creates a new resume for an employee.
        /// </summary>
        public async Task<Resume> CreateResume(PostResume resume)
        {
            ValidateResume(resume);

            var resumeExists = await context.Resumes.AsNoTracking()
                .AnyAsync(r => r.EmployeeId == resume.EmployeeId);

            if (resumeExists)
                throw new InvalidOperationException("Resume for this employee already exists");

            var newResume = new Resume
            {
                EmployeeId = resume.EmployeeId,
                ProfileSummary = resume.ProfileSummary,
                AcademicTraining = resume.AcademicTraining,
                Skills = resume.Skills,
                CreationDate = DateTime.UtcNow,
                Languages = resume.Languages
            };

            await context.Resumes.AddAsync(newResume);
            await context.SaveChangesAsync(); // Aquí ya tenemos newResume.Id

            // Crear experiencias laborales si existen
            if (resume.WorkExpList != null && resume.WorkExpList.Any())
            {
                await CreateWorkExperience(resume.WorkExpList, newResume.Id);
            }

            return newResume;
        }

        /// <summary>
        /// Gets a resume by employee ID.
        /// </summary>
        public async Task<Resume> GetResumeByEmployeeId(int id)
        {
            var resume = await context.Resumes.Include(x=>x.WorkExperience).AsNoTracking()
                .FirstOrDefaultAsync(r => r.EmployeeId == id);

            if (resume == null)
                throw new KeyNotFoundException("Resume not found for this employee");

            return resume;
        }

        /// <summary>
        /// Updates an existing resume.
        /// </summary>
        public async Task<Resume> UpdateResume(int id, PostResume updatedResume)
        {
            ValidateResume(updatedResume);

            var existingResume = await context.Resumes.FindAsync(id);
            if (existingResume == null)
                throw new KeyNotFoundException("Resume not found");

            existingResume.ProfileSummary = updatedResume.ProfileSummary;
            existingResume.AcademicTraining = updatedResume.AcademicTraining;
            existingResume.Skills = updatedResume.Skills;
            existingResume.Languages = updatedResume.Languages;

            context.Resumes.Update(existingResume);
            await context.SaveChangesAsync();

            // Si vienen experiencias laborales nuevas, reemplazarlas
            if (updatedResume.WorkExpList != null && updatedResume.WorkExpList.Any())
            {
                await ClearWorkExperience(id);
                await CreateWorkExperience(updatedResume.WorkExpList, id);
            }

            return existingResume;
        }

        /// <summary>
        /// Deletes a resume by employee ID.
        /// </summary>
        public async Task DeleteResumeByEmployeeId(int id)
        {
            var existingResume = await context.Resumes
                .FirstOrDefaultAsync(r => r.EmployeeId == id);

            if (existingResume == null)
                throw new KeyNotFoundException("User has no resume");

            context.Resumes.Remove(existingResume);
            await context.SaveChangesAsync();
        }

        /// <summary>
        /// Creates work experiences linked to a resume.
        /// </summary>
        public async Task CreateWorkExperience(List<PostWorkExpDTO> workExpList, int resumeId)
        {
            ValidateWorkExperience(workExpList);

            foreach (var item in workExpList)
            {
                var workExp = new WorkExperience
                {
                    ResumeId = resumeId, // ✅ Se asigna aquí automáticamente
                    Position = item.Position,
                    Description = item.Description,
                    StartDate = item.StartDate,
                    EndDate = item.EndDate,
                    CompanyName = item.CompanyName,
                };

                await context.WorkExperiences.AddAsync(workExp);
            }

            await context.SaveChangesAsync();
        }

        /// <summary>
        /// Validates resume data.
        /// </summary>
        public void ValidateResume(PostResume resume)
        {
            switch (resume)
            {
                case null:
                    throw new ArgumentException("Resume data is required");

                case { EmployeeId: <= 0 }:
                    throw new ArgumentException("Invalid Employee ID");

                case { ProfileSummary: var ps } when string.IsNullOrWhiteSpace(ps):
                    throw new ArgumentException("Profile summary cannot be empty");

                case { AcademicTraining: var at } when string.IsNullOrWhiteSpace(at):
                    throw new ArgumentException("Academic training cannot be empty");

                case { Skills: var sk } when string.IsNullOrWhiteSpace(sk):
                    throw new ArgumentException("Skills cannot be empty");

                case { Languages: var lang } when string.IsNullOrWhiteSpace(lang):
                    throw new ArgumentException("Languages cannot be empty");

                case { ProfileSummary: var ps2 } when ps2.Length > 2000:
                    throw new ArgumentException("Profile summary is too long");

                case { AcademicTraining: var at2 } when at2.Length > 2000:
                    throw new ArgumentException("Academic training is too long");
            }
        }

        /// <summary>
        /// Validates work experience data.
        /// </summary>
        public void ValidateWorkExperience(List<PostWorkExpDTO> workExpList)
        {
            if (workExpList == null || !workExpList.Any())
                throw new ArgumentException("Work experience list cannot be empty");

            foreach (var item in workExpList)
            {
                if (string.IsNullOrWhiteSpace(item.Position))
                    throw new ArgumentException("Position cannot be empty");

                if (string.IsNullOrWhiteSpace(item.Description))
                    throw new ArgumentException("Description cannot be empty");

                if (item.StartDate > item.EndDate && item.EndDate != null)
                    throw new ArgumentException("Start date cannot be later than end date");

                if (string.IsNullOrWhiteSpace(item.CompanyName))
                    throw new ArgumentException("Company name cannot be empty");
            }
        }

        /// <summary>
        /// Clears all work experiences for a given resume.
        /// </summary>
        public async Task ClearWorkExperience(int resumeId)
        {
            var list = await context.WorkExperiences
                .Where(x => x.ResumeId == resumeId)
                .ToListAsync();

            context.WorkExperiences.RemoveRange(list);
            await context.SaveChangesAsync();
        }
    }
}
