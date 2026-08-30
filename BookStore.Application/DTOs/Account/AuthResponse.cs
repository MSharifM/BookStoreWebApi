namespace BookStore.Application.DTOs.Account
{
    public class AuthResponse
    {
        public bool IsSuccess { get; set; } = false;

        public string? AccessToken { get; set; }

        public string? RefreshToken { get; set; }

        public string? ErrorMessage { get; set; }
    }
}