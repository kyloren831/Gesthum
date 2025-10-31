using GesthumServer.Models;
using Microsoft.EntityFrameworkCore;

namespace GesthumServer.Services
{
    public interface IEmployeesServices
    {
        Task<Employee> CreateEmployee(Employee employee);
        Task<Employee> GetEmployeeById(int id);
        Task<Employee> UpdateEmployee(int id, Employee updatedEmployee);
        Task<string> GetEmployeePhotoById(int id);
        Task UpdateEmployeePhoto(int id, string photoUrl);
    }

    public class EmployeesServices : IEmployeesServices
    {
        private readonly DbContextGesthum dbContext;

        // Employees service methods would go here
        public EmployeesServices(DbContextGesthum dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Employee> CreateEmployee(Employee employee)
        {
            dbContext.Employees.Add(employee);
            await dbContext.SaveChangesAsync();
            return employee;
        }
        public async Task<Employee> GetEmployeeById(int id)
        {
            var employee = await dbContext.Employees.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
            if (employee == null)
            {
                throw new KeyNotFoundException("Employee not found");
            }
            return employee;
        }
        public async Task<Employee> UpdateEmployee(int id, Employee updatedEmployee)
        {
            var existingEmployee = await dbContext.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                throw new KeyNotFoundException("Employee not found");
            }
            existingEmployee.Name = updatedEmployee.Name;
            existingEmployee.Email = updatedEmployee.Email;
            dbContext.Employees.Update(existingEmployee);
            await dbContext.SaveChangesAsync();
            return existingEmployee;
        }

        public async Task<string> GetEmployeePhotoById(int id)
        {
            var employee = await dbContext.Employees.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
            if (employee == null)
            {
                throw new KeyNotFoundException("Employee not found");
            }
            return employee.PhotoUrl;
        }
        public async Task UpdateEmployeePhoto(int id, string photoUrl)
        {
            var existingEmployee = await dbContext.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                throw new KeyNotFoundException("Employee not found");
            }
            existingEmployee.PhotoUrl = photoUrl;
            dbContext.Employees.Update(existingEmployee);
            await dbContext.SaveChangesAsync();
        }
    }
}
