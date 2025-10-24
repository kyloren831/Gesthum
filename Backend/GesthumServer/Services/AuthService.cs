using GesthumServer.DTOs.Login;
using GesthumServer.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace GesthumServer.Services
{
    public interface IAuthService
    {
        Task<UserClaims> AuthenticateUserAsync(LoginRequest loginRequest, HttpContext HttpContext);
        void SetTokensInsideCookie(AuthResponse tokenDto, HttpContext context);
        void RemoveTokensFromCookie(HttpContext context);
        bool isAuthenticated(HttpContext context);
    }

    public class AuthService : IAuthService
    {
        // Store tokens in HttpOnly cookies
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IUsersServices usersServices;
        private readonly HttpClient httpClient;
        public AuthService(IHttpClientFactory httpClientFactory, DbContextGesthum dbContext, IUsersServices usersServices)
        {
            this.httpClientFactory = httpClientFactory;
            this.usersServices = usersServices;
            httpClient = httpClientFactory.CreateClient("AuthApi");
        }
        public async Task<UserClaims> AuthenticateUserAsync (LoginRequest loginRequest, HttpContext HttpContext)
        {
            var response = await httpClient.PostAsJsonAsync("api/Users/authenticate", loginRequest);
            if (response.IsSuccessStatusCode)
            {
                var authResponse = await response.Content.ReadFromJsonAsync<AuthResponse>();
                SetTokensInsideCookie(authResponse, HttpContext);

                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(authResponse.Token);
                var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid");
                var userRoleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role");

                var userClaims = new UserClaims
                {
                    Id = userIdClaim != null ? int.Parse(userIdClaim.Value) : 0,
                    Role = userRoleClaim?.Value ?? string.Empty,
                    IsFirstLogin = false
                };


                return await usersServices.HandleUserInfo(userClaims, authResponse.Token);
            }
            else
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                throw new Exception($"Authentication failed: {errorMessage}");
            }
        }
        public void SetTokensInsideCookie(AuthResponse tokenDto, HttpContext context)
        {
            context.Response.Cookies.Append("accessToken", tokenDto.Token,
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddHours(1),
                    HttpOnly = true,
                    IsEssential = true,
                    Secure = true,
                    SameSite = SameSiteMode.None
                }
            );
        }
        // Remove tokens from cookies
        public void RemoveTokensFromCookie(HttpContext context)
        {
            context.Response.Cookies.Delete("accessToken");
        }
        // Check if user is authenticated based on presence of access token cookie
        public bool isAuthenticated(HttpContext context)
        {
            return context.Request.Cookies.ContainsKey("accessToken");
        }

    }
}
