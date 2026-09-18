using BookStore.Application.DTOs.CommonDto;

namespace BookStore.Api.CommonMethods
{
    public static class Convertor
    {
        public static async Task<FileDataDto> ConvertIFromFileToFileDataDto(IFormFile file)
        {
            // Convert IFormFile to byte[]
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            // Create Dto
            var fileData = new FileDataDto(
                Content: memoryStream.ToArray(),
                FileName: file.FileName,
                ContentType: file.ContentType
            );

            return fileData;
        }
    }
}