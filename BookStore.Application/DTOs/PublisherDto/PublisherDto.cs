namespace BookStore.Application.DTOs.PublisherDto
{
    public record PublisherSummaryResponse(int PublisherId, string PublisherName, string PublisherImage);

    public record DashboardReportResponse(int CountBooks, int CountSalesBook, decimal TotalIncome);

    public record MonthlyChartIncomeResponse(int Year, int Month, decimal Income);
}