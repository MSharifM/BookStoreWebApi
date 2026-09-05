using BookStore.Application.DTOs.AddressDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class AddressRepository : IAddressRepository
    {
        private readonly ApplicationDbContext _context;

        public AddressRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddAddressAsync(string userId, AddressDto model)
        {
            var isAddressExist = await _context.Addresses
                .Where(a => a.UserId == userId)
                .Select(a => a.AddressId)
                .FirstOrDefaultAsync();

            if (isAddressExist != 0)
                return false;

            await _context.Addresses.AddAsync(new Address()
            {
                City = model.City,
                Detail = model.Detail,
                State = model.State,
                UserId = userId
            });

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<AddressDto?> GetUserAddressAsync(string userId)
        {
            var result = await _context.Addresses
                .Where(a => a.UserId == userId)
                .Select(a => new AddressDto()
                {
                    City = a.City,
                    Detail = a.Detail,
                    State = a.State
                })
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<bool> UpdateAddressAsync(string userId, AddressDto model)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (address is null)
                return false;

            address.City = model.City;
            address.Detail = model.Detail;
            address.State = model.State;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}