using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<User?> GetUserByEmailOrUserNameAsync(string emailOrUserName)
        {
            var user = _context.Users
                .FirstOrDefaultAsync(u => u.UserName == emailOrUserName
                                          || u.Email == emailOrUserName);

            return user;
        }
    }
}