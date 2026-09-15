using BookStore.Application.DTOs.OrderDto;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
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
        public async Task<IActionResult> FinalizeOrder()
        {
            await _orderService.FinalizeOrderAsync(UserId);

            return Ok();
        }

        // POST /api/order
        [HttpPost]
        public async Task<IActionResult> PaymentResult(PaymentGatewayRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _orderService.ProcessingPaymentResultAsync(model);
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
            var result = await _orderService.GetOrderDetailAsync(UserId, orderId);

            return Ok(result);
        }
    }
}