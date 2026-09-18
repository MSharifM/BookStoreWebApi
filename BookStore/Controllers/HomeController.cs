using BookStore.Application.DTOs.BookDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IBookRepository _bookRepository;
        private readonly IBannerRepository _bannerRepository;
        private readonly IPublisherService _publisherService;

        public HomeController(IBookRepository bookRepository, IBannerRepository bannerRepository, IPublisherService publisherService)
        {
            _bookRepository = bookRepository;
            _bannerRepository = bannerRepository;
            _publisherService = publisherService;
        }

        [HttpGet("newest")]
        public async Task<IActionResult> GetNewestBooks()
        {
            var result = await _bookRepository.GetNewestBooksAsync();

            return Ok(result);
        }

        [HttpGet("bestsellers")]
        public async Task<IActionResult> GetBestSellerBooks()
        {
            var result = await _bookRepository.GetBestSellerBooksAsync();

            return Ok(result);
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularBooks()
        {
            var result = await _bookRepository.GetPopularBooksAsync();

            return Ok(result);
        }

        [HttpGet("most-discount")]
        public async Task<IActionResult> GetMostDiscount()
        {
            // TODO: Implement discount service
            return Ok(new List<BookSummaryResponse>());
        }

        [HttpGet("bestsellers-publisher")]
        public async Task<IActionResult> GetBestSellerPublisher()
        {
            var result = await _publisherService.GetBestSellersPublisher();

            return Ok(result);
        }

        [HttpGet("banner")]
        public async Task<IActionResult> GetBanner()
        {
            var result = await _bannerRepository.GetHomePageBannerAsync();

            return Ok(result);
        }
    }
}