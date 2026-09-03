using System.ComponentModel.DataAnnotations;

namespace BookStore.Application.DTOs.AccountDto
{
    public class LoginRequest
    {
        [Required]
        public string UserNameOrEmail { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}