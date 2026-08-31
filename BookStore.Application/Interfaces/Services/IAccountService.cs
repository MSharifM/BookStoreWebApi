using BookStore.Application.DTOs.Account;
using Microsoft.AspNetCore.Identity;

namespace BookStore.Application.Interfaces.Services
{
    public interface IAccountService
    {
        Task<IdentityResult> RegisterAsync(RegisterRequest model);

        Task<AuthResponse> LoginAsync(LoginRequest model);

        Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest model);

        Task<bool> LogoutAsync(RefreshTokenRequest model);
    }
}