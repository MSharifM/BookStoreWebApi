namespace BookStore.Application.Interfaces.Services
{
    public interface IJwtService
    {
        string GenerateAccessToken(string userId, string userName, IEnumerable<string> roles);

        string GenerateRefreshToken();
    }
}