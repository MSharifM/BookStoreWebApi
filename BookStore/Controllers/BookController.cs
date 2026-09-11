using BookStore.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookRepository _bookRepository;

        public BookController(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        // GET /api/book/{bookId}
        [HttpGet("{bookId:int}")]
        public async Task<IActionResult> GetBookDetail(int bookId)
        {
            var result = await _bookRepository.GetBookDetailAsync(bookId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        // GET /api/book/{bookId}/reviews
        [HttpGet("{bookId:int}/reviews")]
        public async Task<IActionResult> GetBookReviews(int bookId, [FromQuery] int page = 1)
        {
            if (page < 1)
                return BadRequest("Page must be greater than or equal to 1");

            var result = await _bookRepository.GetBookReviews(bookId, page);

            return Ok(result);
        }
    }
}