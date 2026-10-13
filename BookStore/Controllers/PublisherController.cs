using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BookStore.Application.DTOs.BookDto;
using BookStore.Application.Interfaces.Services;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Publisher")]
    public class PublisherController : ControllerBase
    {
        private readonly IPublisherService _publisherService;

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        public PublisherController(IPublisherService publisherService)
        {
            _publisherService = publisherService;
        }

        // GET /api/publisher/report
        [HttpGet("report")]
        public async Task<IActionResult> GetDashboardRepost()
        {
            var result = await _publisherService.GetDashboardReportAsync(UserId);

            return Ok(result);
        }

        // GET /api/publisher/chart
        [HttpGet("chart")]
        public async Task<IActionResult> GetChartIncome(int? year, int? month)
        {
            var result = await _publisherService.GetMonthlyChartAsync(UserId, year, month);

            return Ok(result);
        }

        // GET /api/publisher/books
        [HttpGet("books")]
        public async Task<IActionResult> GetPublisherBooks([FromQuery] FilterSearchBookRequest model, int page = 1)
        {
            var result = await _publisherService.GetPublisherBooksAsync(UserId, model, page);

            return Ok(result);
        }

        // GET /api/publisher/search
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchPublishersByName(string? name)
        {
            var result = await _publisherService.SearchPublisherByNameAsync(name);

            return Ok(result);
        }
    }
}