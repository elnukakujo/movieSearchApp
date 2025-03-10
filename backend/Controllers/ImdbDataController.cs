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
            var topRated = await _tmdbService.GetTopRatedAsync(SelectedMode, Language);
            return Ok(topRated);
            
        }
        [HttpGet("findById")]
        public async Task<IActionResult> Search([FromQuery] string MediaType, [FromQuery] int id, [FromQuery] string Language)
        {
            var searchResults = await _tmdbService.GetDetailsAsync(MediaType, id, Language);
            return Ok(searchResults);
        }
        [HttpGet("recommendation")]
        public async Task<IActionResult> Recommendation([FromQuery] string MediaType, [FromQuery] int id, [FromQuery] string Language)
        {
            var recommendationResults = await _tmdbService.GetRecommendationAsync(MediaType, id, Language);
            return Ok(recommendationResults);
        }
        [HttpGet("seasonsDetails")]
        public async Task<IActionResult> GetSeasonsDetails([FromQuery] int id, [FromQuery] int SeasonID, [FromQuery] string Language)
        {
            var seasonResults = await _tmdbService.GetSeasonsDetailsAsync(id, SeasonID, Language);
            return Ok(seasonResults);
        }
        [HttpGet("episodeDetails")]
        public async Task<IActionResult> GetEpisodeDetails([FromQuery] int id, [FromQuery] int season_number, [FromQuery] int episode_number, [FromQuery] string Language)
        {
            var episodeResults = await _tmdbService.GetEpisodeDetailsAsync(id, season_number, episode_number, Language);
            return Ok(episodeResults);
        }
        [HttpGet("search")]
        public async Task<IActionResult> GetSearchDetails([FromQuery] string Query, [FromQuery] string Language)
        {
            var episodeResults = await _tmdbService.GetSearchDetailsAsync(Query, Language);
            return Ok(episodeResults);
        }
        [HttpGet("collection")]
        public async Task<IActionResult> GetCollectionDetails([FromQuery] int id, [FromQuery] string Language)
        {
            var episodeResults = await _tmdbService.GetCollectionDetailsAsync(id, Language);
            return Ok(episodeResults);
        }
        [HttpGet("person")]
        public async Task<IActionResult> GetPersonDetails([FromQuery] int id, [FromQuery] string Language)
        {
            var personResults = await _tmdbService.GetPersonDetailsAsync(id, Language);
            return Ok(personResults);
        }
        [HttpGet("reviews")]
        public async Task<IActionResult> GetReviews([FromQuery] string MediaType, [FromQuery] int id, [FromQuery] string Language)
        {
            var reviewResults = await _tmdbService.GetReviewsAsync(MediaType, id, Language);
            return Ok(reviewResults);
        }
    }
}