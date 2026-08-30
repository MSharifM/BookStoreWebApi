using BookStore.Application.DTOs.Account;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAccountService _accountService;

        public AuthController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _accountService.RegisterAsync(model);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _accountService.LoginAsync(model);

            if (!result.IsSuccess)
                return Unauthorized(result.ErrorMessage);

            return Ok(result);
        }
    }
}