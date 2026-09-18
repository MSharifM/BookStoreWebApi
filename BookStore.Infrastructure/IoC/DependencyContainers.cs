using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Application.Services;
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
            service.AddScoped<IReviewService, ReviewService>();
            service.AddScoped<IDapperContext, DapperContext>();
            service.AddScoped<IPublisherService, PublisherService>();
            service.AddScoped<IBookService, BookService>();

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
            service.AddScoped<IReviewRepository, ReviewRepository>();

            #endregion Repositories
        }
    }
}