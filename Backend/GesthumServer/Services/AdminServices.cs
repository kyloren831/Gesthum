using GesthumServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GesthumServer.Services
{
    public interface IAdminServices
    {
        Task<Admin> CreateAdmin(Admin admin);
        Task<Admin> GetAdminById(int id);
        Task<Admin> UpdateAdmin(int id, Admin updatedAdmin);
    }

    public class AdminServices : IAdminServices
    {
        private readonly DbContextGesthum dbContext;

        // Admins service methods would go here
        public AdminServices(DbContextGesthum dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Admin> CreateAdmin(Admin admin)
        {
            dbContext.Admins.Add(admin);
            await dbContext.SaveChangesAsync();
            return admin;
        }
        public async Task<Admin> GetAdminById(int id)
        {
            var admin = await dbContext.Admins.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
            if (admin == null)
            {
                throw new KeyNotFoundException("Admin not found");
            }
            return admin;
        }
        public async Task<Admin> UpdateAdmin(int id, Admin updatedAdmin)
        {
            var existingAdmin = await dbContext.Admins.FindAsync(id);
            if (existingAdmin == null)
            {
                throw new KeyNotFoundException("Admin not found");
            }
            existingAdmin.Name = updatedAdmin.Name;
            existingAdmin.Email = updatedAdmin.Email;
            dbContext.Admins.Update(existingAdmin);
            await dbContext.SaveChangesAsync();
            return existingAdmin;
        }
    }
}
