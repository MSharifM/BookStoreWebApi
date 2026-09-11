using BookStore.Application.DTOs.UserProfileDto;
using BookStore.Domain.Entities;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailOrUserNameAsync(string emailOrUserName);

        Task<UserPanelDetailResponse?> GetUserPanelDetailAsync(string userId);

        Task<ProfileInformationResponse?> GetUserInformationAsync(string userId);
    }
}