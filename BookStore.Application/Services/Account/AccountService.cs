using BookStore.Application.DTOs.Account;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace BookStore.Application.Services.Account
{
    public class AccountService : IAccountService
    {
        private readonly IJwtService _jwtService;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public AccountService(UserManager<User> userManager, IJwtService jwtService, IConfiguration configuration, IUserRepository userRepository, IRefreshTokenRepository refreshTokenRepository)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _configuration = configuration;
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<IdentityResult> RegisterAsync(RegisterRequest model)
        {
            var user = new User()
            {
                UserName = model.UserName,
                Email = model.Email,
                Cart = new Cart()
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
                await _userManager.AddToRoleAsync(user, "User");

            return result;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest model)
        {
            var result = new AuthResponse();
            var user = await _userRepository.GetUserByEmailOrUserNameAsync(model.UserNameOrEmail);

            string errorMessageInvalidInformation = "نام کاربری یا رمز عبور اشتباه است";
            if (user is null)
            {
                result.ErrorMessage = errorMessageInvalidInformation;
                return result;
            }
            if (await _userManager.IsLockedOutAsync(user))
            {
                result.ErrorMessage = "حساب شما به دلیل وارد کردن بیش از حد رمز  به مدت 20 دقیقه قفل شده است.";
                return result;
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!passwordValid)
            {
                await _userManager.AccessFailedAsync(user);
                result.ErrorMessage = errorMessageInvalidInformation;
                return result;
            }

            await _userManager.ResetAccessFailedCountAsync(user);

            var roles = await _userManager.GetRolesAsync(user);
            var (accessToken, refreshToken) = await GenerateNewAccessTokenAndRefreshTokenAsync(
                user.Id, user.UserName!, roles);

            result.IsSuccess = true;
            result.AccessToken = accessToken;
            result.RefreshToken = refreshToken;

            return result;
        }

        public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest model)
        {
            var result = new AuthResponse();
            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(model.RefreshToken);
            if (refreshToken is null || refreshToken.ExpiryDate <= DateTime.UtcNow
                                     || refreshToken.RevokedDate.HasValue)
            {
                result.ErrorMessage = "توکن نامعتبر است یا منقضی شده است لطفا د.وباره وارد شوید";
                return result;
            }

            var user = await _userManager.FindByIdAsync(refreshToken.UserId);
            if (user is null)
            {
                result.ErrorMessage = "توکن نامعتبر است";
                return result;
            }

            // Rotation
            await _refreshTokenRepository.RevokeAsync(refreshToken);

            var roles = await _userManager.GetRolesAsync(user);
            var (newAccessToken, newRefreshToken) = await GenerateNewAccessTokenAndRefreshTokenAsync(
                user.Id, user.UserName!, roles);

            result.IsSuccess = true;
            result.AccessToken = newAccessToken;
            result.RefreshToken = newRefreshToken;

            return result;
        }

        private async Task<(string AccessToken, string RefreshToken)> GenerateNewAccessTokenAndRefreshTokenAsync(
            string userId, string userName, IEnumerable<string> roles)
        {
            var accessToken = _jwtService.GenerateAccessToken(userId, userName!, roles);
            var refreshToken = _jwtService.GenerateRefreshToken();
            var refreshTokenExpirationDays = int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"]!);

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = userId,
                CreatedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddDays(refreshTokenExpirationDays)
            };

            await _refreshTokenRepository.AddAsync(refreshTokenEntity);

            return (accessToken, refreshToken);
        }

        public async Task<bool> LogoutAsync(RefreshTokenRequest model)
        {
            var token = await _refreshTokenRepository.GetByTokenAsync(model.RefreshToken);

            if (token is null || token.RevokedDate.HasValue)
                return false;

            await _refreshTokenRepository.RevokeAsync(token);

            return true;
        }
    }
}