using BookStore.Domain.Enums;

namespace BookStore.Application.DTOs.AuthorDto
{
    public record AuthorSummaryResponse(int AuthorId, string AuthorName, string ImageName);
}