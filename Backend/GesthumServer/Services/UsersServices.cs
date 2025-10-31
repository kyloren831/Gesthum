using GesthumServer.DTOs.Login;
using GesthumServer.Models;
using System.Net.Http.Headers;

namespace GesthumServer.Services
{
    public interface IUsersServices
    {
        Task<UserClaims> CreateUserInfo(UserClaims userClaims, UserInfo userInfo);
        Task<UserInfo> GetUserInfoById(int id, string token);
        Task<UserClaims> HandleUserInfo(UserClaims userClaims, string token);
        Task<UserClaims> UpdateUserInfo(UserClaims userClaims, UserInfo userInfo);
    }

    public class UsersServices : IUsersServices
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IEmployeesServices employeesServices;
        private readonly IAdminServices adminServices;
        private readonly HttpClient httpClient;
        public UsersServices(IHttpClientFactory httpClientFactory, DbContextGesthum dbContext, IEmployeesServices employeesServices, IAdminServices adminServices)
        {
            this.httpClientFactory = httpClientFactory;
            this.employeesServices = employeesServices;
            this.adminServices = adminServices;
            this.httpClient = httpClientFactory.CreateClient("AuthApi");
        }
        public async Task<Boolean> IsFirstTimeEmployee(int id)
        {
            try
            {
                var isEmployee = await employeesServices.GetEmployeeById(id);
                return false;
            }
            catch (KeyNotFoundException knfEx)
            {
                return true;
            }
        }
        public async Task<Boolean> IsFirstTimeAdmin(int id)
        {
            try
            {
                var isAdmin = await adminServices.GetAdminById(id);
                return false;
            }
            catch (KeyNotFoundException knfEx)
            {
                return true;
            }
        }
        public async Task<UserInfo> GetUserInfoById(int id, string token)
        {
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await httpClient.GetAsync($"api/Users/{id}");
            if (response.IsSuccessStatusCode)
            {
                var userInfo = await response.Content.ReadFromJsonAsync<UserInfo>();
                return userInfo;
            }
            else
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Failed to get user info: {errorMessage}");
            }
        }
        public async Task<UserClaims> UpdateUserInfo(UserClaims userClaims, UserInfo userInfo)
        {

            if (userClaims.Role == "Admin")
            {
                var existingAdmin = await adminServices.GetAdminById(userClaims.Id);
                var updatedAdmin = new Admin
                {
                    Id = userClaims.Id,
                    Name = userInfo.Name,
                    Email = userInfo.Email
                };
                var user = await adminServices.UpdateAdmin(userClaims.Id, updatedAdmin);
                userClaims.IsFirstLogin = false;
                return userClaims;
            }
            else
            {
                var existingEmployee = await employeesServices.GetEmployeeById(userClaims.Id);
                var updatedEmployee = new Employee
                {
                    Id = userClaims.Id,
                    Name = userInfo.Name,
                    Email = userInfo.Email
                };
                var user = await employeesServices.UpdateEmployee(userClaims.Id, updatedEmployee);
                userClaims.IsFirstLogin = false;
                return userClaims;
            }
        }

        public async Task<UserClaims> CreateUserInfo(UserClaims userClaims, UserInfo userInfo)
        {
            if (userClaims.Role == "Admin")
            {
                await adminServices.CreateAdmin(new Admin
                {
                    Id = userClaims.Id,
                    Name = userInfo.Name,
                    Email = userInfo.Email,
                    Photo = ""
                });
            }
            else if (userClaims.Role == "Employee")
            {
                await employeesServices.CreateEmployee(new Employee
                {
                    Id = userClaims.Id,
                    Name = userInfo.Name,
                    Email = userInfo.Email,
                    Department = userInfo.Department,
                    Position = userInfo.JobPosition
                });
            }
            userClaims.IsFirstLogin = true;
            return userClaims;
        }

        public async Task<UserClaims> HandleUserInfo(UserClaims userClaims, string token)
        {
            var userInfo = await GetUserInfoById(userClaims.Id, token);
            var firstTimeA = await IsFirstTimeAdmin(userClaims.Id);
            var firstTimeB = await IsFirstTimeEmployee(userClaims.Id);
            // Both first time
            if (firstTimeA && firstTimeB) return await CreateUserInfo(userClaims, userInfo);
            return await UpdateUserInfo(userClaims, userInfo);
        }

    }

}
