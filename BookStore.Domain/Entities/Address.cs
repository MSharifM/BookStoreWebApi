namespace BookStore.Domain.Entities
{
    public class Address
    {
        public int AddressId { get; set; }

        public string State { get; set; } = null!;

        public string City { get; set; } = null!;

        public string Detail { get; set; } = null!;

        #region Relations

        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        #endregion Relations
    }
}