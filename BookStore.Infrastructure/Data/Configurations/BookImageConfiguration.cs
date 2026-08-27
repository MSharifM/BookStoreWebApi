using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class BookImageConfiguration : IEntityTypeConfiguration<BookImage>
    {
        public void Configure(EntityTypeBuilder<BookImage> builder)
        {
            // Primary key
            builder.HasKey(b => b.BookImageId);

            // Properties
            builder.Property(b => b.ImageName)
                .HasDefaultValue("DefaultBookImage.jpg")
                .HasMaxLength(200);

            // Relationship
            builder.HasOne(b => b.Book)
                .WithMany(b => b.BookImages)
                .HasForeignKey(b => b.BookId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}