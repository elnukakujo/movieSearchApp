using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TmdbDataController: ControllerBase
    {
        private readonly TmdbService _tmdbService;

        public TmdbDataController(TmdbService tmdbService)
        {
            _tmdbService = tmdbService;
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingMovies([FromQuery] string Language, [FromQuery] string Region)
        {
            var trendingMovies = await _tmdbService.GetUpcomingMoviesAsync(Language, Region);
            return Ok(trendingMovies);
        }

        [HttpGet("trending")]
        public async Task<IActionResult> GetTrendingMovies([FromQuery] string TimeInterval, [FromQuery] string Language)
        {
            var trendingMovies = await _tmdbService.GetTrendingMoviesAsync(TimeInterval, Language);
            return Ok(trendingMovies);
        }
        [HttpGet("top_rated")]
        public async Task<IActionResult> GetTopRatedMovies([FromQuery] string Language)
        {
            try
            {
                var topRatedMovies = await _tmdbService.GetTopRatedMoviesAsync(Language);
                return Ok(topRatedMovies);
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                Console.WriteLine($"Error fetching top rated movies: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}