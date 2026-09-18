namespace BookStore.Application.Exceptions
{
    public abstract class AppException(string message, ErrorCode code) : Exception(message)
    {
        public ErrorCode Code { get; } = code;
    }

    public class InsufficientStockException()
        : AppException("موجودی کتاب‌های سبد خرید کافی نیست.", ErrorCode.BadRequest);

    public class EmptyCartException()
        : AppException("سبد خرید شما خالی است.", ErrorCode.BadRequest);

    public class OrderNotFoundException()
        : AppException("سفارش مورد نظر یافت نشد.", ErrorCode.NotFound);

    public class AddressNotFoundException()
        : AppException("لطفاً ابتدا آدرس پیش‌فرض خود را ثبت کنید.", ErrorCode.BadRequest);

    public class UserNotFoundException()
        : AppException("کاربر مورد نظر یافت نشد.", ErrorCode.NotFound);

    public class ReviewNotFoundException()
        : AppException("نظر یافت نشد.", ErrorCode.NotFound);

    public class BookNotPurchasedException()
        : AppException("برای نظر دادن باید کتاب را خریداری کرده باشید.", ErrorCode.Forbidden);

    public class DuplicateISBNException()
        : AppException("برای نظر دادن باید کتاب را خریداری کرده باشید.", ErrorCode.Conflict);

    public enum ErrorCode
    {
        BadRequest = 1,
        NotFound = 2,
        Forbidden = 3,
        Unauthorized = 4,
        Conflict = 5,
        InternalServerError = 6
    }
}