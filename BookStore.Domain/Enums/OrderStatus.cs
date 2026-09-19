namespace BookStore.Domain.Enums
{
    public enum OrderStatus
    {
        Pending = 0,
        Processing = 1,
        Shipped = 2,
        Cancelled = 3,
        Failed = 4
    }
}