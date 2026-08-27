using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            // Primary key
            builder.HasKey(a => a.AddressId);

            // Properties
            builder.Property(a => a.City)
                .IsRequired();

            builder.Property(a => a.State)
                .IsRequired();

            builder.Property(a => a.Detail)
                .IsRequired();

            // Relationship
            builder.HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId);
        }
    }
}