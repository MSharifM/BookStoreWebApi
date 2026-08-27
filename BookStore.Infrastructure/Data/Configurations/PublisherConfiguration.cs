using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class PublisherConfiguration : IEntityTypeConfiguration<Publisher>
    {
        public void Configure(EntityTypeBuilder<Publisher> builder)
        {
            // Primary key
            builder.HasKey(p => p.PublisherId);

            // Properties
            builder.Property(p => p.ImagePath)
                .HasMaxLength(150)
                .HasDefaultValue("DefaultPublisherProfile.jpg");

            builder.Property(p => p.EstablishmentDate)
                .IsRequired();

            builder.HasIndex(p => p.UserId)
                .IsUnique();

            // Relationship
            builder.HasOne(p => p.User)
                .WithOne(u => u.Publisher)
                .HasForeignKey<Publisher>(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}