using BookStore.Application.DTOs.CartDto;
using BookStore.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        public CartController(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(AddCartRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _cartRepository.AddToCartAsync(UserId!, model);

            if (!result)
                return BadRequest();

            return Ok(result);
        }

        [HttpGet("detail")]
        public async Task<IActionResult> GetCartDetail()
        {
            var result = await _cartRepository.GetCartDetailAsync(UserId!);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromCart(int bookId)
        {
            var result = await _cartRepository.RemoveFromCartAsync(UserId!, bookId);

            if (!result)
                return NotFound();

            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCart(int bookId, bool isIncrease)
        {
            var result = await _cartRepository.UpdateCartAsync(UserId!, bookId, isIncrease);

            if (!result)
                return BadRequest();

            return Ok(result);
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            await _cartRepository.ClearCartAsync(UserId!);

            return Ok();
        }
    }
}