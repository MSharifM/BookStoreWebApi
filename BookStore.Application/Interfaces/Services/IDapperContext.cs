using System.Data;

namespace BookStore.Application.Interfaces.Services
{
    public interface IDapperContext
    {
        IDbConnection CreateConnection();
    }
}