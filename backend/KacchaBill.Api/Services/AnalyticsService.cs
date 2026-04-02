using KacchaBill.Api.DTOs;
using KacchaBill.Api.Repositories;

namespace KacchaBill.Api.Services;

public class AnalyticsService(IAnalyticsRepository analyticsRepository) : IAnalyticsService
{
    public Task<List<InsightDto>> TopProductsAsync() => analyticsRepository.GetTopProductsAsync();

    public Task<List<InsightDto>> TopCategoriesAsync() => analyticsRepository.GetTopCategoriesAsync();
}
