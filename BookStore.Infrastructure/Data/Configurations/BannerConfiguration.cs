using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class BannerConfiguration : IEntityTypeConfiguration<Banner>
    {
        public void Configure(EntityTypeBuilder<Banner> builder)
        {
            // Primary key
            builder.HasKey(b => b.BannerId);

            // Properties
            builder.Property(b => b.ImagePath)
                .IsRequired();

            builder.Property(b => b.Url)
                .IsRequired();
        }
    }
}