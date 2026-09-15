using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Application.Services.Account;
using BookStore.Application.Services.Order;
using BookStore.Infrastructure.Repositories;
using BookStore.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BookStore.Infrastructure.IoC
{
    public class DependencyContainers
    {
        public static void RegisterServices(IServiceCollection service)
        {
            #region Services

            service.AddScoped<IJwtService, JwtService>();
            service.AddScoped<IAccountService, AccountService>();
            service.AddScoped<IFileStorageService, FileStorageService>();
            service.AddScoped<IOrderService, OrderService>();
            service.AddScoped<IUnitOfWorkService, UnitOfWorkService>();
            service.AddScoped<IDapperContext, DapperContext>();

            #endregion Services

            #region Repositories

            service.AddScoped<IBannerRepository, BannerRepository>();
            service.AddScoped<IUserRepository, UserRepository>();
            service.AddScoped<ICartRepository, CartRepository>();
            service.AddScoped<IFavoriteRepository, FavoriteRepository>();
            service.AddScoped<IPublisherRepository, PublisherRepository>();
            service.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            service.AddScoped<IBookRepository, BookRepository>();
            service.AddScoped<IAddressRepository, AddressRepository>();
            service.AddScoped<IOrderRepository, OrderRepository>();

            #endregion Repositories
        }
    }
}