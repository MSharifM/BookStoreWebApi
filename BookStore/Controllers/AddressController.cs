using BookStore.Application.DTOs.AddressDto;
using BookStore.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class AddressController : ControllerBase
    {
        private readonly IAddressRepository _addressRepository;
        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        public AddressController(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddAddress(AddressDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _addressRepository.AddAddressAsync(UserId, model);

            if (!result)
                return Problem("آدرس برای این کاربر موجود است");

            return Created();
        }

        [HttpGet]
        public async Task<IActionResult> GetUserAddress()
        {
            var result = await _addressRepository.GetUserAddressAsync(UserId);

            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUserAddress(AddressDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _addressRepository.UpdateAddressAsync(UserId, model);

            if (!result)
                return NotFound();

            return Ok();
        }
    }
}