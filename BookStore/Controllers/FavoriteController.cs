using BookStore.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        public FavoriteController(IFavoriteRepository favoriteRepository)
        {
            _favoriteRepository = favoriteRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToFavorite(int bookId)
        {
            var result = await _favoriteRepository.AddToFavoriteAsync(UserId!, bookId);

            if (!result)
                return BadRequest();

            return Ok(result);
        }

        [HttpGet("detail")]
        public async Task<IActionResult> GetFavoriteDetail()
        {
            var result = await _favoriteRepository.GetFavoriteItemsDetailAsync(UserId!);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromFavorite(int bookId)
        {
            var result = await _favoriteRepository.RemoveFromFavoriteAsync(UserId!, bookId);

            if (!result)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearFavorite()
        {
            await _favoriteRepository.ClearFavoriteAsync(UserId!);

            return Ok();
        }
    }
}