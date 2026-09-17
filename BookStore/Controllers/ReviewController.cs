using System.Security.Claims;
using BookStore.Application.DTOs.ReviewDto;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // GET /api/review/{bookId}
        [HttpGet("{bookId:int}")]
        public async Task<IActionResult> GetBookReviews(int bookId, [FromQuery] int page = 1)
        {
            if (page < 1)
                return BadRequest("Page must be greater than or equal to 1");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _reviewService.GetBookReviewsAsync(bookId, page, userId);

            return Ok(result);
        }

        // POST /api/review
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AddReview(AddReviewRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            await _reviewService.AddReviewAsync(userId, model);

            return Created();
        }

        // POST /api/review/reaction
        [HttpPost("reaction")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AddOrUpdateReaction(ReactionRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            await _reviewService.AddOrUpdateReactionAsync(userId, model);

            return Ok();
        }

        // DELETE /api/review/{reviewId}
        [HttpPost("{reviewId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            await _reviewService.DeleteReviewAsync(reviewId);

            return Ok();
        }
    }
}