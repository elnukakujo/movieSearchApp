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
            var upcomingMovies = await _tmdbService.GetUpcomingMoviesAsync(Language, Region);
            return Ok(upcomingMovies);
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
            var topRatedMovies = await _tmdbService.GetTopRatedMoviesAsync(Language);
            return Ok(topRatedMovies);
            
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchMovies([FromQuery] int movie_id, [FromQuery] string Language)
        {
            var searchResults = await _tmdbService.GetMovieDetails(movie_id, Language);
            return Ok(searchResults);
        }
    }
}