using GesthumServer.DTOs.Login;
using GesthumServer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace GesthumServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        public AuthController( IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                return Ok(await authService.AuthenticateUserAsync(loginRequest, HttpContext));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // Remove tokens from cookies
            authService.RemoveTokensFromCookie(HttpContext);
            return NoContent();
        }
        [HttpGet("validate")]
        public IActionResult ValidateToken()
        {
            // Check if the user is authenticated based on the presence of the access token cookie
            return authService.isAuthenticated(HttpContext) ? Ok(new { Message = "Sesion Valida." }) : Unauthorized(new { Message = "Sesion Invalida." });
        }
    }
}
