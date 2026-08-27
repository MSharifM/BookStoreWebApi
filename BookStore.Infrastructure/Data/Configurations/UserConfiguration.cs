using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Properties
            builder.Property(u => u.ImageProfile)
                .HasMaxLength(200)
                .HasDefaultValue("DefaultUserProfile.jpg");
        }
    }
}