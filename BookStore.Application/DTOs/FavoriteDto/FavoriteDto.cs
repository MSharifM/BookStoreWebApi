namespace BookStore.Application.DTOs.FavoriteDto
{
    public class FavoriteItemsDetailResponse
    {
        public int BookId { get; set; }
        public string BookName { get; set; } = null!;
        public string BookImage { get; set; } = null!;
    }
}