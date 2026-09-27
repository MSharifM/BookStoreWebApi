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
        private readonly IBookService _bookService;
        private readonly IBannerRepository _bannerRepository;
        private readonly IPublisherService _publisherService;

        public HomeController(IBookService bookService, IBannerRepository bannerRepository, IPublisherService publisherService)
        {
            _bookService = bookService;
            _bannerRepository = bannerRepository;
            _publisherService = publisherService;
        }

        // GET /api/home/newest
        [HttpGet("newest")]
        public async Task<IActionResult> GetNewestBooks()
        {
            var result = await _bookService.SearchAndFilterAllBooksAsync(
                new FilterSearchBookRequest() { SortBy = BookSortBy.Newest });

            return Ok(result);
        }

        // GET /api/home/bestsellers
        [HttpGet("bestsellers")]
        public async Task<IActionResult> GetBestSellerBooks()
        {
            var result = await _bookService.SearchAndFilterAllBooksAsync(
                new FilterSearchBookRequest() { SortBy = BookSortBy.BestSelling });

            return Ok(result);
        }

        // GET /api/home/popular
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularBooks()
        {
            var result = await _bookService.SearchAndFilterAllBooksAsync(
                new FilterSearchBookRequest() { SortBy = BookSortBy.Popular });

            return Ok(result);
        }

        // GET /api/home/most-discount
        [HttpGet("most-discount")]
        public async Task<IActionResult> GetMostDiscount()
        {
            // TODO: Implement discount service
            return Ok(new List<BookSummaryResponse>());
        }

        // GET /api/home/bestsellers-publisher
        [HttpGet("bestsellers-publisher")]
        public async Task<IActionResult> GetBestSellerPublisher()
        {
            var result = await _publisherService.GetBestSellersPublisher();

            return Ok(result);
        }

        // GET /api/home/banner
        [HttpGet("banner")]
        public async Task<IActionResult> GetBanner()
        {
            var result = await _bannerRepository.GetHomePageBannerAsync();

            return Ok(result);
        }

        // GET /api/home/search?name={name}
        [HttpGet("search")]
        public async Task<IActionResult> Search(string name)
        {
            var result = await _bookService.SummarySearchByBookNameAsync(name);

            return Ok(result);
        }
    }
}