namespace BookStore.Application.DTOs.PublisherDto
{
    public class PublisherSummaryResponse
    {
        public int PublisherId { get; set; }
        public string PublisherName { get; set; } = null!;
        public string PublisherImage { get; set; } = null!;
    }

    public record DashboardReportResponse(int CountBooks, int CountSalesBook, decimal TotalIncome);

    public record MonthlyChartIncomeResponse(int Year, int Month, decimal Income);
}