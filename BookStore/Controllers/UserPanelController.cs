using BookStore.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserPanelController : ControllerBase
    {
        private readonly IUserPanelRepository _userPanelRepository;
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        public UserPanelController(IUserPanelRepository userPanelRepository)
        {
            _userPanelRepository = userPanelRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserPanelDetail()
        {
            var result = await _userPanelRepository.GetUserPanelDetailAsync(UserId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}