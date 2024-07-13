using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RestSharp;

namespace backend
{
    public class TmdbService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = new ApiKey()._apiKey;

        public TmdbService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<JsonArray> GetUpcomingMoviesAsync([FromQuery] string Language, [FromQuery] string Region)
        {
            var url = $"https://api.themoviedb.org/3/movie/upcoming?api_key={_apiKey}&language={Language}&region={Region}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var upcomingMovies = JsonNode.Parse(content)["results"].AsArray();

            foreach (var movie in upcomingMovies)
            {
                movie["poster_path"] = $"https://image.tmdb.org/t/p/w500{movie["poster_path"]?.ToString()}";
                movie["backdrop_path"] = $"https://image.tmdb.org/t/p/w780{movie["backdrop_path"]?.ToString()}";
                movie["media_type"] = "movie";
            }

            return upcomingMovies;
        }
        public async Task<JsonArray> GetTrendingAsync([FromQuery] string SelectedMode, [FromQuery] string Language)
        {
            var url = $"https://api.themoviedb.org/3/trending/all/{SelectedMode}?api_key={_apiKey}&language={Language}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var trendingMovies = JsonNode.Parse(content)["results"].AsArray();

            foreach (var movie in trendingMovies)
            {
                movie["poster_path"] = $"https://image.tmdb.org/t/p/w500{movie["poster_path"]?.ToString()}";
                movie["backdrop_path"] = $"https://image.tmdb.org/t/p/w780{movie["backdrop_path"]?.ToString()}";
            }

            return trendingMovies;
        }
        public async Task<JsonArray> GetTopRatedAsync([FromQuery] string SelectedMode, [FromQuery] string Language)
        {
            var url = $"https://api.themoviedb.org/3/{SelectedMode}/top_rated?api_key={_apiKey}&language={Language}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var topRated = JsonNode.Parse(content)["results"].AsArray();

            foreach (var element in topRated)
            {
                element["poster_path"] = $"https://image.tmdb.org/t/p/w500{element["poster_path"]?.ToString()}";
                element["backdrop_path"] = $"https://image.tmdb.org/t/p/w780{element["backdrop_path"]?.ToString()}";
                element["media_type"] = SelectedMode;
            }

            return topRated;
        }
        public async Task<JsonNode> GetDetailsAsync([FromQuery] string MediaType, [FromQuery] int id, [FromQuery] string Language)
        {
            var url = $"https://api.themoviedb.org/3/{MediaType}/{id}?api_key={_apiKey}&language={Language}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            JsonNode details = JsonNode.Parse(content);

            // Transform poster_path and backdrop_path URLs
            details["poster_path"] = $"https://image.tmdb.org/t/p/w500{details["poster_path"]?.ToString()}";
            details["backdrop_path"] = $"https://image.tmdb.org/t/p/w780{details["backdrop_path"]?.ToString()}";

            // Transform belongs_to_collection poster_path and backdrop_path URLs
            if (details["belongs_to_collection"] != null)
            {
                details["belongs_to_collection"]["poster_path"] = $"https://image.tmdb.org/t/p/w500{details["belongs_to_collection"]["poster_path"]?.ToString()}";
                details["belongs_to_collection"]["backdrop_path"] = $"https://image.tmdb.org/t/p/w780{details["belongs_to_collection"]["backdrop_path"]?.ToString()}";
            }

            // Transform production_companies logo_path URLs
            foreach (JsonNode productionCompany in details["production_companies"].AsArray())
            {
                if (productionCompany != null && productionCompany["logo_path"] != null)
                {
                    string logoPath = productionCompany["logo_path"].ToString();
                    productionCompany["logo_path"] = $"https://image.tmdb.org/t/p/w500{logoPath}";
                }
            }

            return details;
        }
        public async Task<JsonNode> GetRecommendationAsync([FromQuery] string SelectedMode, [FromQuery] int id, [FromQuery] string Language)
        {
            var url = $"https://api.themoviedb.org/3/{SelectedMode}/{id}/recommendations?api_key={_apiKey}&language={Language}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var recommendations = JsonNode.Parse(content)["results"].AsArray();

            foreach (var element in recommendations)
            {
                element["poster_path"] = $"https://image.tmdb.org/t/p/w500{element["poster_path"]?.ToString()}";
                element["backdrop_path"] = $"https://image.tmdb.org/t/p/w780{element["backdrop_path"]?.ToString()}";
                element["media_type"] = SelectedMode;
            }

            return recommendations;
        }
        public async Task<JsonNode> GetSeasonsDetailsAsync([FromQuery] int series_id, [FromQuery] int season_number, [FromQuery] string Language)
        {
            var options = new RestClientOptions($"https://api.themoviedb.org/3/tv/{series_id}/season/{season_number}?api_key={_apiKey}&language={Language}");
            var client = new RestClient(options);
            var request = new RestRequest("");
            var response = await client.GetAsync(request);
            var episodes = JsonNode.Parse(response.Content)["episodes"].AsArray();

            foreach (var episode in episodes)
            {
                episode["still_path"] = $"https://image.tmdb.org/t/p/w500{episode["still_path"]?.ToString()}";
            }

            return episodes;
        }
        public async Task<JsonNode> GetEpisodeDetailsAsync([FromQuery] int serie_id, [FromQuery] int season_number, [FromQuery] int episode_number, [FromQuery] string Language)
        {
            var options = new RestClientOptions(
                $"https://api.themoviedb.org/3/tv/{serie_id}/season/{season_number}/episode/{episode_number}?api_key={_apiKey}&language={Language}"
            );
            var client = new RestClient(options);
            var request = new RestRequest("");
            var response = await client.GetAsync(request);
            var episode = JsonNode.Parse(response.Content)?.AsObject();
    
            if (episode != null && episode.ContainsKey("still_path"))
            {
                var stillPath = episode["still_path"]?.ToString();
                if (!string.IsNullOrEmpty(stillPath))
                {
                    episode["still_path"] = $"https://image.tmdb.org/t/p/w500{stillPath}";
                }
            }

            return episode;
        }
        public async Task<JsonNode> GetSearchDetailsAsync([FromQuery] string Query, [FromQuery] string Language)
        {
            var queries = $"?query={Query}&language={Language}&api_key={_apiKey}";
            var options = new RestClientOptions(
                $"https://api.themoviedb.org/3/search/multi"+queries
            );
            var client = new RestClient(options);
            var request = new RestRequest("");
            var response = await client.GetAsync(request);
            var results = JsonNode.Parse(response.Content)["results"].AsArray();

            foreach(var result in results){
                result["poster_path"] = $"https://image.tmdb.org/t/p/w500{result["poster_path"]}";
                result["backdrop_path"] = $"https://image.tmdb.org/t/p/w500{result["backdrop_path"]}";
            }
            return results;
        }
    }
}