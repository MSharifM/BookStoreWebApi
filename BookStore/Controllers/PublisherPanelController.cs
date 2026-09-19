using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BookStore.Application.Interfaces.Services;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Publisher")]
    public class PublisherPanelController : ControllerBase
    {
        private readonly IPublisherService _publisherService;

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        public PublisherPanelController(IPublisherService publisherService)
        {
            _publisherService = publisherService;
        }

        // GET /api/publisherPanel/report
        [HttpGet("report")]
        public async Task<IActionResult> GetDashboardRepost()
        {
            var result = await _publisherService.GetDashboardReportAsync(UserId);

            return Ok(result);
        }

        // GET /api/publisherPanel/chart
        [HttpGet("chart")]
        public async Task<IActionResult> GetChartIncome(int? year, int? month)
        {
            var result = await _publisherService.GetMonthlyChartAsync(UserId, year, month);

            return Ok(result);
        }

        // GET: /api/publisherPanel/myBooks
        [HttpGet("myBooks")]
        public async Task<IActionResult> GetPublisherBooks()
        {
            throw new NotImplementedException();
        }
    }
}