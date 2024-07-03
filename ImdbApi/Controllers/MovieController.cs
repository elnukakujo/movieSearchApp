using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

namespace IMDbApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public MoviesController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovie(string id)
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"https://api.example.com/movies/{id}");
            
            if (!response.IsSuccessStatusCode)
            {
                return NotFound();
            }

            var data = await response.Content.ReadAsStringAsync();
            return Ok(data);
        }
    }
}