using Microsoft.AspNetCore.Mvc;


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

        [HttpGet("trending")]
        public async Task<IActionResult> GetTrendingMovies()
        {
            var trendingMovies = await _tmdbService.GetTrendingMoviesAsync();
            return Ok(trendingMovies);
        }
    }
}