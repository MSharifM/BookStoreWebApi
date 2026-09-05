using BookStore.Application.DTOs.UserProfileDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IUserPanelRepository
    {
        Task<UserPanelDetailResponse?> GetUserPanelDetailAsync(string userId);
    }
}