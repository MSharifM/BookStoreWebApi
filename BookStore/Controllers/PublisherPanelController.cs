using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Publisher")]
    public class PublisherPanelController : ControllerBase
    {
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // GET: /api/publisherPanel/myBooks
        [HttpGet("myBooks")]
        public async Task<IActionResult> GetPublisherBooks()
        {
            return Ok();
        }
    }
}