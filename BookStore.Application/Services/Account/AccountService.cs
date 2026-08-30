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

            var accessToken = _jwtService.GenerateAccessToken(user.Id, user.UserName!);
            var refreshToken = _jwtService.GenerateRefreshToken();
            var refreshTokenExpirationDays = int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"]!);

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                CreatedDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddDays(refreshTokenExpirationDays)
            };

            await _refreshTokenRepository.AddAsync(refreshTokenEntity);

            result.IsSuccess = true;
            result.AccessToken = accessToken;
            result.RefreshToken = refreshToken;

            return result;
        }
    }
}