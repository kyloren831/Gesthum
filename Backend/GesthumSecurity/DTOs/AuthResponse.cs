namespace GesthumSecurity.DTOs
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public string Message { get; set; }
        public bool IsAuthenticated => !string.IsNullOrEmpty(Token);
    }
}
