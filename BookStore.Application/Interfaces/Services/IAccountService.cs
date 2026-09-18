using BookStore.Application.DTOs.AccountDto;
using BookStore.Application.DTOs.UserProfileDto;
using Microsoft.AspNetCore.Identity;

namespace BookStore.Application.Interfaces.Services
{
    public interface IAccountService
    {
        Task<IdentityResult> RegisterAsync(RegisterRequest model);

        Task<AuthResponse> LoginAsync(LoginRequest model);

        Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest model);

        Task<bool> LogoutAsync(RefreshTokenRequest model);

        Task<IdentityResult> EditUserProfileAsync(string userId, EditProfileRequest newModel);

        Task<IdentityResult?> ChangePasswordAsync(string userId, ChangePasswordRequest model);
    }
}