using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Application.Services.Account;
using BookStore.Infrastructure.Repositories;
using BookStore.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BookStore.Infrastructure.IoC
{
    public class DependencyContainers
    {
        public static void RegisterServices(IServiceCollection service)
        {
            service.AddScoped<IJwtService, JwtService>();
            service.AddScoped<IAccountService, AccountService>();
            service.AddScoped<IDapperContext, DapperContext>();
            service.AddScoped<IBannerRepository, BannerRepository>();
            service.AddScoped<IUserRepository, UserRepository>();
            service.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            service.AddScoped<IBookRepository, BookRepository>();
        }
    }
}