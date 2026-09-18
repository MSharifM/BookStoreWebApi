using BookStore.Application.DTOs.CommonDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(FileDataDto file, string folderName, string[] extensions);

        void DeleteFile(string fileName, string folderName);
    }
}