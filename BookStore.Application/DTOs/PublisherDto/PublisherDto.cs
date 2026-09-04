namespace BookStore.Application.DTOs.PublisherDto
{
    public class PublisherSummaryResponse
    {
        public int PublisherId { get; set; }
        public string PublisherName { get; set; } = null!;
        public string PublisherImage { get; set; } = null!;
    }
}