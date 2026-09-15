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
    }
}