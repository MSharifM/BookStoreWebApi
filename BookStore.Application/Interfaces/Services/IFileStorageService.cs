using BookStore.Application.DTOs.CommonDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveImageAsync(FileDataDto file, string folderName);

        void DeleteImage(string fileName, string folderName);
    }
}