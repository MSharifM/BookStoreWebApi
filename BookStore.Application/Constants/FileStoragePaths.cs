namespace BookStore.Application.Constants
{
    public static class FileStorageConstants
    {
        public static class Paths
        {
            private const string BaseImages = "images";

            public const string UserProfile = $"{BaseImages}/user_profile/";
            public const string BookImage = $"{BaseImages}/book/";
            public const string Banner = $"{BaseImages}/banners/";
            public const string BookDemo = "demo_pdfs/";
        }

        // Default values
        public static class Defaults
        {
            public const string UserProfileImage = "DefaultUserProfile.jpg";
        }

        public static class AllowedExtensions
        {
            public static readonly string[] Images = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
            public static readonly string[] Documents = [".pdf"];
        }
    }
}