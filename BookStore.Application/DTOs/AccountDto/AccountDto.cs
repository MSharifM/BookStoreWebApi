using System.ComponentModel.DataAnnotations;

namespace BookStore.Application.DTOs.AccountDto
{
    public class AuthResponse
    {
        public bool IsSuccess { get; set; } = false;
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime AccessTokenExpiresAt { get; set; }
        public DateTime RefreshTokenExpiresAt { get; set; }
    }

    public class LoginRequest
    {
        [Required]
        public string UserNameOrEmail { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = null!;
    }

    public class RegisterRequest
    {
        [Required]
        [MaxLength(200, ErrorMessage = "{0} نمی تواند بیشتر از {1} کاراکتر باشد.")]
        public string UserName { get; set; } = null!;

        [Required]
        [MaxLength(200, ErrorMessage = "{0} نمی تواند بیشتر از {1} کاراکتر باشد.")]
        public string Email { get; set; } = null!;

        [Required]
        [MaxLength(200, ErrorMessage = "{0} نمی تواند بیشتر از {1} کاراکتر باشد.")]
        public string Password { get; set; } = null!;

        [MaxLength(200, ErrorMessage = "{0} نمی تواند بیشتر از {1} کاراکتر باشد.")]
        [Compare("Password", ErrorMessage = "کلمه عبور  با تکرار آن برابر نیست")]
        public string RePassword { get; set; } = null!;
    }

    public class ChangePasswordRequest
    {
        [Required]
        public string OldPassword { get; set; } = null!;

        [Required]
        [MaxLength(200, ErrorMessage = "{0} نمی تواند بیشتر از {1} کاراکتر باشد.")]
        public string NewPassword { get; set; } = null!;

        [MaxLength(200, ErrorMessage = "{0} نمی تواند بیشتر از {1} کاراکتر باشد.")]
        [Compare("NewPassword", ErrorMessage = "کلمه عبور  با تکرار آن برابر نیست")]
        public string ConfirmPassword { get; set; } = null!;
    }
}