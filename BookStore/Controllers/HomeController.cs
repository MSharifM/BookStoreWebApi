using BookStore.Application.DTOs.BookDto;
using BookStore.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IBookRepository _bookRepository;
        private readonly IBannerRepository _bannerRepository;
        private readonly IPublisherRepository _publisherRepository;

        public HomeController(IBookRepository bookRepository, IBannerRepository bannerRepository, IPublisherRepository publisherRepository)
        {
            _bookRepository = bookRepository;
            _bannerRepository = bannerRepository;
            _publisherRepository = publisherRepository;
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
            var result = await _publisherRepository.GetBestSellerPublisher();

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