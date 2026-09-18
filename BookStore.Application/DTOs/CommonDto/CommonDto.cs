namespace BookStore.Application.DTOs.CommonDto
{
    public record FileDataDto(
        byte[] Content,
        string FileName,
        string ContentType
    )
    {
        public string? UniqName { get; set; }
    };
}