using Microsoft.EntityFrameworkCore;

namespace GesthumServer.Models
{
    public class DbContextGesthum : DbContext
    {
        public DbSet<Admin>Admins{ get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Resume> Resumes { get; set; }
        public DbSet<Vacancy> Vacancies { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<WorkExperience> WorkExperiences { get; set; }
        public DbContextGesthum(DbContextOptions<DbContextGesthum> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Additional configuration can be added here if needed
            modelBuilder.Entity<WorkExperience>()
                .HasOne(wke=> wke.Resume)
                .WithMany(r=> r.WorkExperience)
                .HasForeignKey(wke=> wke.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
