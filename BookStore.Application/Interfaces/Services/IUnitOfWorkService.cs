using BookStore.Application.Interfaces.Repositories;

namespace BookStore.Application.Interfaces.Services
{
    public interface IUnitOfWorkService
    {
        Task BeginTransactionAsync(CancellationToken cancellationToken = default);

        Task CommitAsync(CancellationToken cancellationToken = default);

        Task RollbackAsync(CancellationToken cancellationToken = default);
    }
}