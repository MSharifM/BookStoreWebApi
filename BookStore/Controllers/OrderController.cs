using BookStore.Application.DTOs.CartDto;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // POST /api/order/submit-cart
        [HttpPost("submit-cart")]
        public async Task<IActionResult> FinalizeOrder(CartDetailResponse model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _orderService.FinalizeOrderAsync(UserId);

            if (!result)
                return NotFound();

            return Ok();
        }

        // POST /api/order
        [HttpPost]
        public async Task<IActionResult> PaymentResult(int orderId, bool isSuccess)
        {
            await _orderService.ProcessingPaymentResultAsync(orderId, isSuccess);
            return Ok();
        }

        // GET /api/order
        [HttpGet]
        public async Task<IActionResult> GetUserOrdersSummary()
        {
            var result = await _orderService.GetUserOrdersAsync(UserId);

            return Ok(result);
        }

        // GET /api/order/{orderId}
        [HttpGet("{orderId:int}")]
        public async Task<IActionResult> GetOrderDetail(int orderId)
        {
            var result = await _orderService.GetOrderDetailAsync(orderId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}