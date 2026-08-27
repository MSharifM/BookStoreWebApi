namespace BookStore.Domain.Entities
{
    public class Banner
    {
        public int BannerId { get; set; }

        public string ImagePath { get; set; } = null!;

        public string Url { get; set; } = null!;

        public DateTime StartDate { get; set; } = DateTime.Now;

        public DateTime EndDate { get; set; }
    }
}