using BookStore.Application.DTOs.BookDto;
using BookStore.Application.DTOs.PublisherDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;

namespace BookStore.Application.Services
{
    public class PublisherService : IPublisherService
    {
        private readonly IPublisherRepository _publisherRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IBookService _bookService;

        private async Task<int> PublisherId(string userId) => await _publisherRepository.GetPublisherIdAsync(userId);

        public PublisherService(IPublisherRepository publisherRepository, IOrderRepository orderRepository, IBookService bookService)
        {
            _publisherRepository = publisherRepository;
            _orderRepository = orderRepository;
            _bookService = bookService;
        }

        public async Task<List<PublisherSummaryResponse>> GetBestSellersPublisher()
        {
            var result = await _publisherRepository.GetBestSellersPublisherAsync();

            return result;
        }

        public async Task<List<BookSummaryResponse>> GetPublisherBooksAsync(string userId, FilterSearchBookRequest model, int page = 1)
        {
            model.PublisherIds = [await PublisherId(userId)];

            var result = await _bookService.SearchAndFilterAllBooksAsync(model);

            return result;
        }

        public async Task<DashboardReportResponse> GetDashboardReportAsync(string userId)
        {
            var publisherId = await PublisherId(userId);

            var (totalSold, totalIncome) = await _orderRepository
                .GetPublisherSalesSummaryAsync(publisherId);
            var countBooks = await _publisherRepository.GetCountPublisherBookAsync(publisherId);

            var report = new DashboardReportResponse(
                CountBooks: countBooks,
                CountSalesBook: totalSold,
                TotalIncome: totalIncome
                );

            return report;
        }

        public async Task<List<MonthlyChartIncomeResponse>> GetMonthlyChartAsync(string userId, int? year = null, int? month = null)
        {
            var referenceDate = (year.HasValue && month.HasValue)
                ? new DateTime(year.Value, month.Value, 1)
                : DateTime.UtcNow;

            var fromDate = new DateTime(referenceDate.Year, referenceDate.Month, 1).AddMonths(-11);
            var toDate = new DateTime(referenceDate.Year, referenceDate.Month, 1).AddMonths(1);

            var rawData = await _orderRepository.GetMonthlyPublisherIncomeAsync(
                await PublisherId(userId), fromDate, toDate);

            // Make list by 12 item
            var result = Enumerable.Range(0, 12)
                .Select(i => fromDate.AddMonths(i))
                .Select(d =>
                {
                    var found = rawData.FirstOrDefault(r => r.Year == d.Year && r.Month == d.Month);
                    return new MonthlyChartIncomeResponse(d.Year, d.Month, found?.Income ?? 0);
                })
                .ToList();

            return result;
        }
    }
}