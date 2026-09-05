using BookStore.Application.DTOs.AddressDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IAddressRepository
    {
        Task<bool> AddAddressAsync(string userId, AddressDto model);

        Task<AddressDto?> GetUserAddressAsync(string userId);

        Task<bool> UpdateAddressAsync(string userId, AddressDto model);
    }
}