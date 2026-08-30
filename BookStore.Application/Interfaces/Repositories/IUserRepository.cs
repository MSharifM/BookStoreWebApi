using BookStore.Domain.Entities;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailOrUserNameAsync(string emailOrUserName);
    }
}