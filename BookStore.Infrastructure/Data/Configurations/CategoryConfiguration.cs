using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            // Primary key
            builder.HasKey(c => c.CategoryId);

            // Properties
            builder.Property(c => c.CategoryName)
                .IsRequired()
                .HasMaxLength(30);

            builder.HasIndex(c => c.CategoryName)
                .IsUnique();
        }
    }
}