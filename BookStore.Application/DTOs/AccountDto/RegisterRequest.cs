using System.ComponentModel.DataAnnotations;

namespace BookStore.Application.DTOs.AccountDto
{
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
}