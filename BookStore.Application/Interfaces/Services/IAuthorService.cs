using BookStore.Application.DTOs.AuthorDto;
using BookStore.Domain.Enums;

namespace BookStore.Application.Interfaces.Services
{
    public interface IAuthorService
    {
        Task<List<AuthorSummaryResponse>> SearchAuthorByName(string? name);
    }
}