namespace BookStore.Domain.Entities
{
    public class Publisher
    {
        public int PublisherId { get; set; }

        public string ImagePath { get; set; } = null!;

        public string Description { get; set; } = null!;

        public DateTime EstablishmentDate { get; set; }

        #region Relations

        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        public virtual List<Book> Books { get; set; } = new();

        #endregion Relations
    }
}