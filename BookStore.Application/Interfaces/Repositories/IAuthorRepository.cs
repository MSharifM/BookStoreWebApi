using BookStore.Application.DTOs.AuthorDto;
using BookStore.Domain.Enums;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IAuthorRepository
    {
        Task<List<AuthorSummaryResponse>> SearchAuthorByNameAsync(string? name);
    }
}