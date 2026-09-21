using BookStore.Application.DTOs.BookDto;
using BookStore.Application.DTOs.PublisherDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IPublisherService
    {
        Task<List<PublisherSummaryResponse>> GetBestSellersPublisher();

        Task<List<BookSummaryResponse>> GetPublisherBooksAsync(string userId, FilterSearchBookRequest model, int page = 1);

        Task<DashboardReportResponse> GetDashboardReportAsync(string userId);

        Task<List<MonthlyChartIncomeResponse>> GetMonthlyChartAsync(string userId, int? year = null, int? month = null);
    }
}