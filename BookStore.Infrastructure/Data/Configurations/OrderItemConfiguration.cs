using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            // Primary key
            builder.HasKey(o => new { o.BookId, o.OrderId });

            // Properties
            builder.Property(o => o.UnitPrice)
                .HasPrecision(20, 0)
                .IsRequired();

            // Relationship
            builder.HasOne(o => o.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(o => o.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(o => o.Book)
                .WithMany(b => b.OrderItems)
                .HasForeignKey(o => o.BookId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}