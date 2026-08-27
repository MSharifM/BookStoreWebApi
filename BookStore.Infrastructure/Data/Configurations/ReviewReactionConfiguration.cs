using BookStore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookStore.Infrastructure.Data.Configurations
{
    public class ReviewReactionConfiguration : IEntityTypeConfiguration<ReviewReaction>
    {
        public void Configure(EntityTypeBuilder<ReviewReaction> builder)
        {
            // Primary key
            builder.HasKey(r => new { r.UserId, r.ReviewId });

            // Relationship
            builder.HasOne(r => r.User)
                .WithMany(u => u.ReviewReactions)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(r => r.Review)
                .WithMany(r => r.ReviewReactions)
                .HasForeignKey(r => r.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}