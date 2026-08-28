using BookStore.Application.Interfaces;
using BookStore.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BookStore.Infrastructure.IoC
{
    public class DependencyContainers
    {
        public static void RegisterServices(IServiceCollection service)
        {
            service.AddScoped<IJwtService, JwtService>();
        }
    }
}