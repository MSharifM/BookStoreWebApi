using BookStore.Application.DTOs.UserProfileDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<UserPanelDetailResponse?> GetUserPanelDetailAsync(string userId);

        Task<ProfileInformationResponse?> GetUserInformationAsync(string userId);
    }
}