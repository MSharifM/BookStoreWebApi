using BookStore.Application.Constants;
using BookStore.Application.DTOs.BookDto;
using BookStore.Application.Exceptions;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;

namespace BookStore.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;
        private readonly IPublisherRepository _publisherRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IUnitOfWorkService _unitOfWorkService;

        public BookService(IBookRepository bookRepository, IFileStorageService fileStorageService, IPublisherRepository publisherRepository, IUnitOfWorkService unitOfWorkService)
        {
            _bookRepository = bookRepository;
            _fileStorageService = fileStorageService;
            _publisherRepository = publisherRepository;
            _unitOfWorkService = unitOfWorkService;
        }

        public async Task<List<BookSummaryResponse>> GetNewestBooksAsync(int? publisherId = null, int page = 1, int step = 15)
        {
            var result = await _bookRepository.GetNewestBooksAsync(publisherId, page, step);

            return result;
        }

        public async Task<List<BookSummaryResponse>> GetPopularBooksAsync(int? publisherId = null, int page = 1, int step = 15)
        {
            var result = await _bookRepository.GetPopularBooksAsync(publisherId, page, step);

            return result;
        }

        public async Task<List<BookSummaryResponse>> GetBestSellerBooksAsync(int? publisherId = null, int page = 1, int step = 15)
        {
            var result = await _bookRepository.GetBestSellerBooksAsync(publisherId, page, step);

            return result;
        }

        public async Task<BookDetailResponse?> GetBookDetailAsync(int bookId)
        {
            var result = await _bookRepository.GetBookDetailAsync(bookId);

            return result;
        }

        public async Task AddBookAsync(string userId, AddBookRequest model)
        {
            var isExistISBN = await _bookRepository.IsExitsISBNAsync(model.ISBN);
            if (isExistISBN)
                throw new DuplicateISBNException();

            var publisherId = await _publisherRepository.GetPublisherIdAsync(userId);

            await _unitOfWorkService.BeginTransactionAsync();

            try
            {
                foreach (var image in model.BookImages)
                {
                    image.File!.UniqName = await _fileStorageService.SaveFileAsync(image.File,
                        FileStorageConstants.Paths.BookImage, FileStorageConstants.AllowedExtensions.Images);
                }
                if (model.DemoPDFFile != null)
                    model.DemoPDFFile.UniqName = await _fileStorageService.SaveFileAsync(model.DemoPDFFile, FileStorageConstants.Paths.BookDemo,
                        FileStorageConstants.AllowedExtensions.Documents);

                await _bookRepository.CreateBookAsync(publisherId, model);

                await _unitOfWorkService.CommitAsync();
            }
            catch
            {
                foreach (var image in model.BookImages) // Delete saved images
                {
                    if (string.IsNullOrEmpty(image.File!.UniqName))
                        break;

                    _fileStorageService.DeleteFile(image.File.UniqName, FileStorageConstants.Paths.BookImage);
                }

                if (model.DemoPDFFile is { UniqName: not null })
                    _fileStorageService.DeleteFile(model.DemoPDFFile.UniqName, FileStorageConstants.Paths.BookDemo);

                await _unitOfWorkService.RollbackAsync();
                throw;
            }
        }

        public async Task DeleteBookAsync(string userId, int bookId)
        {
            var publisherId = await _publisherRepository.GetPublisherIdAsync(userId);

            await _bookRepository.DeleteBookAsync(publisherId, bookId);
        }
    }
}