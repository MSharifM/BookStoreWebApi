using BookStore.Api.CommonMethods;
using BookStore.Application.DTOs.BookDto;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // GET /api/book/{bookId}
        [HttpGet("{bookId:int}")]
        public async Task<IActionResult> GetBookDetail(int bookId)
        {
            var result = await _bookService.GetBookDetailAsync(bookId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        // POST /api/book
        [HttpPost]
        [Authorize(Roles = "Publisher")]
        public async Task<IActionResult> AddBook([FromForm] AddBookRequest model,
             IFormFileCollection images, IFormFile? demoPdfFile = null)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (model.BookImages.Count != images.Count)
                return BadRequest(new { Message = "تعداد تصاویر با تعداد فایل‌های ارسالی مطابقت ندارد." });
            if (!model.BookImages.Any(b => b.IsMain) || model.BookImages.Count(b => b.IsMain) > 1)
                return BadRequest(new { Message = "فقط یک عکس به عناون عکس اصلی باید انتخاب شود." });

            for (int i = 0; i < model.BookImages.Count; i++)
            {
                if (images[i].Length > 5 * 1024 * 1024)  // 5 MB
                    return BadRequest("حجم هر تصویر نباید بیشتر از 5 مگابایت باشد.");

                model.BookImages[i].File = await Convertor.ConvertIFromFileToFileDataDto(images[i]);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            if (demoPdfFile != null)
                model.DemoPDFFile = await Convertor.ConvertIFromFileToFileDataDto(demoPdfFile);

            await _bookService.AddBookAsync(userId, model);

            return Created();
        }

        [HttpDelete("{bookId:int}")]
        [Authorize(Roles = "Publisher")]
        public async Task<IActionResult> AddBook(int bookId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            await _bookService.DeleteBookAsync(userId, bookId);

            return Ok();
        }
    }
}