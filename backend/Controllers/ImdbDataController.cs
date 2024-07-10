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
        public async Task<IActionResult> GetTrending([FromQuery] string SelectedMode, [FromQuery] string Language)
        {
            var trendingMovies = await _tmdbService.GetTrendingAsync(SelectedMode, Language);
            return Ok(trendingMovies);
        }
        [HttpGet("top_rated")]
        public async Task<IActionResult> GetTopRated([FromQuery] string SelectedMode, [FromQuery] string Language)
        {
            var topRatedMovies = await _tmdbService.GetTopRatedAsync(SelectedMode, Language);
            return Ok(topRatedMovies);
            
        }
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string MediaType, [FromQuery] int id, [FromQuery] string Language)
        {
            var searchResults = await _tmdbService.GetDetails(MediaType, id, Language);
            return Ok(searchResults);
        }
    }
}