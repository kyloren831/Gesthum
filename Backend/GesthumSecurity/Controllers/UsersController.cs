using GesthumSecurity.DTOs;
using GesthumSecurity.Models;
using GesthumSecurity.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GesthumSecurity.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IAuthService authService;
        private readonly DbContextSecurity context;

        public UsersController(IAuthService authService, DbContextSecurity context)
        {
            this.authService = authService;
            this.context = context;
        }
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] LoginRequest request)
        {
            // Call the authentication service
            // Authenticate the user
            // Generate JWT token if authentication is successful
            var authResponse = await authService.Authenticate(request.Email, request.Password);
            if (!string.IsNullOrEmpty(authResponse.Token))
            {
                return Ok(authResponse);
            }
            return Unauthorized(new { Message = authResponse.Message });
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }
                var userInfo = new
                {
                    user.Email,
                    user.Name,
                    user.JobPosition,
                    user.Department
                };
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
