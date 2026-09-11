using BookStore.Application.DTOs.CommonDto;
using BookStore.Application.DTOs.UserProfileDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserPanelController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAccountService _accountService;

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        public UserPanelController(IUserRepository userRepository, IAccountService accountService)
        {
            _userRepository = userRepository;
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserPanelDetail()
        {
            var result = await _userRepository.GetUserPanelDetailAsync(UserId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfileInformation()
        {
            var result = await _userRepository.GetUserInformationAsync(UserId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditUserProfile([FromForm] EditProfileRequest model, IFormFile? file)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (file is { Length: > 5 * 1024 * 1024 })
                return BadRequest("حجم فایل نباید بیشتر از ۵ مگابایت باشد.");

            if (file != null)
                model.ImageData = await ConvertIFormFileToDto(file);

            var result = await _accountService.EditUserProfileAsync(UserId, model);

            if (result is null)
                return NotFound();

            if (result.Succeeded)
                return Ok(true);

            return BadRequest(result.Errors);
        }

        private async Task<FileDataDto> ConvertIFormFileToDto(IFormFile file)
        {
            // Convert IFormFile to byte[]
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            // Create Dto
            var fileData = new FileDataDto(
                Content: memoryStream.ToArray(),
                FileName: file.FileName,
                ContentType: file.ContentType
            );

            return fileData;
        }
    }
}