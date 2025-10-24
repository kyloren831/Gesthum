namespace GesthumServer.DTOs.Login
{
    public class UserClaims
    {
        public int Id {get; set; }
        public string Role { get; set; }
        public bool IsFirstLogin { get; set; }
    }
}
