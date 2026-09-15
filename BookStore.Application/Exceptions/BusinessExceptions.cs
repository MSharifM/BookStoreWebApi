namespace BookStore.Application.Exceptions
{
    public class InsufficientStockException : Exception
    {
        public InsufficientStockException() : base("موجودی کتاب‌های سبد خرید کافی نیست.")
        {
        }
    }

    public class EmptyCartException : Exception
    {
        public EmptyCartException() : base("سبد خرید شما خالی است.")
        {
        }
    }

    public class OrderNotFoundException : Exception
    {
        public OrderNotFoundException() : base("سفارش مورد نظر یافت نشد.")
        {
        }
    }

    public class AddressNotFoundException : Exception
    {
        public AddressNotFoundException() : base("لطفاً ابتدا آدرس پیش‌فرض خود را ثبت کنید.")
        {
        }
    }

    public class UserNotFoundException : Exception
    {
        public UserNotFoundException() : base("کاربر مورد نظر یافت نشد.")
        {
        }
    }

    public class ReviewNotFoundException : Exception
    {
        public ReviewNotFoundException() : base("نظر یافت نشد.")
        {
        }
    }
}