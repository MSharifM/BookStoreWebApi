namespace BookStore.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateAccessToken(string userId, string userName);

        string GenerateRefreshToken();
    }
}