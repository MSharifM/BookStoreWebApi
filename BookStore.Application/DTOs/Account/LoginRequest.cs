using System.ComponentModel.DataAnnotations;

namespace BookStore.Application.DTOs.Account
{
    public class LoginRequest
    {
        [Required]
        public string UserNameOrEmail { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}