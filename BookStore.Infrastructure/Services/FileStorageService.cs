using BookStore.Application.Constants;
using BookStore.Application.DTOs.CommonDto;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;

namespace BookStore.Infrastructure.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileStorageService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<string> SaveImageAsync(FileDataDto file, string folderName)
        {
            var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, folderName);

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!Array.Exists(FileStorageConstants.AllowedExtensions.Images
                    , ext => ext == extension))
            {
                throw new InvalidOperationException("فرمت فایل مجاز نیست.");
            }

            var uniqueFileName = GenerateUniqName(extension);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            await File.WriteAllBytesAsync(filePath, file.Content);

            return uniqueFileName;
        }

        public void DeleteImage(string fileName, string folderName)
        {
            if (fileName != FileStorageConstants.Defaults.UserProfileImage)
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, folderName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                if (File.Exists(filePath))
                    File.Delete(filePath);
            }
        }

        private string GenerateUniqName(string extension)
            => $"{Guid.NewGuid().ToString().Replace("-", "")}{extension}";
    }
}