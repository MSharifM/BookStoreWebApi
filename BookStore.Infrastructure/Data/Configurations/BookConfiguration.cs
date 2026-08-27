using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class BookConfiguration : IEntityTypeConfiguration<Book>
    {
        public void Configure(EntityTypeBuilder<Book> builder)
        {
            // Primary key
            builder.HasKey(b => b.BookId);

            // Properties
            builder.Property(b => b.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(b => b.ISBN)
                .IsRequired();

            builder.Property(b => b.Price)
                .IsRequired()
                .HasPrecision(18, 0);

            builder.Property(b => b.Language)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(b => b.DemoPDFPath)
                .HasMaxLength(150);

            // Relationship
            builder.HasOne(b => b.Publisher)
                .WithMany(p => p.Books)
                .HasForeignKey(b => b.PublisherId)
                .OnDelete(DeleteBehavior.Restrict);

            // Index
            builder.HasIndex(b => b.ISBN)
                .IsUnique();
        }
    }
}