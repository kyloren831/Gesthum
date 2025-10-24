using GesthumSecurity.DTOs;
using GesthumSecurity.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GesthumSecurity.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Authenticate(string email, string password);
        string GenerateJwtToken(int id, string name, string email, bool isAdmin);
        Task<User> ValidateUser(string email, string password);
    }

    public class AuthService : IAuthService
    {
        private readonly DbContextSecurity dbContext;
        private readonly IConfiguration configuration;

        // Authentication logic will be implemented here
        public AuthService(DbContextSecurity dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this.configuration = configuration;
        }

        public async Task<AuthResponse> Authenticate(string email, string password)
        {
            var response = new AuthResponse();
            User user = await ValidateUser(email, password);
            if (user != null)
            {
                var token = GenerateJwtToken(user.Id, user.Name, user.Email, user.IsAdmin);
                response.Token = token;
                response.Message = "Authentication successful";
            }
            else
            {
                response.Token = string.Empty;
                response.Message = "Invalid email or password";
            }
            return response;
        }

        public async Task<User> ValidateUser(string email, string password)
        {
            // User validation logic will be implemented here
            User? user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
            return user;
        }
        public string GenerateJwtToken(int id, string name, string email, bool isAdmin)
        {
            // JWT token generation logic will be implemented here
            var jwtKey = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]);
            var claims = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Name, name),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, isAdmin ? "Admin" : "Employee")
            });
            var credentials = new SigningCredentials(new SymmetricSecurityKey(jwtKey), SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"],
                SigningCredentials = credentials
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
