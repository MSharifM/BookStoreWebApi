using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class AuthorConfiguration : IEntityTypeConfiguration<Author>
    {
        public void Configure(EntityTypeBuilder<Author> builder)
        {
            // Primary key
            builder.HasKey(a => a.AuthorId);

            // Properties
            builder.Property(a => a.FullName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.ImagePath)
                .HasMaxLength(150)
                .HasDefaultValue("DefaultAuthorProfile.jpg");
        }
    }
}