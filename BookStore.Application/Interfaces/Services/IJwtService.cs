namespace BookStore.Application.Interfaces.Services
{
    public interface IJwtService
    {
        string GenerateAccessToken(string userId, string userName);

        string GenerateRefreshToken();
    }
}