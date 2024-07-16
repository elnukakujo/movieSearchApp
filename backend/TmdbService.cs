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
            try
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
                if (details["belongs_to_collection"] is JsonObject collection && collection.ContainsKey("poster_path") && collection.ContainsKey("backdrop_path"))
                {
                    collection["poster_path"] = $"https://image.tmdb.org/t/p/w500{collection["poster_path"]?.ToString()}";
                    collection["backdrop_path"] = $"https://image.tmdb.org/t/p/w780{collection["backdrop_path"]?.ToString()}";
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

                // Get the cast and crew profiles
                var creditsUrl = $"https://api.themoviedb.org/3/{MediaType}/{id}/credits?api_key={_apiKey}&language={Language}";
                var creditsResponse = await _httpClient.GetAsync(creditsUrl);
                creditsResponse.EnsureSuccessStatusCode();

                var creditsContent = await creditsResponse.Content.ReadAsStringAsync();
                var credits = JsonNode.Parse(creditsContent).AsObject();

                if (credits != null)
                {
                    var castArray = new JsonArray();
                    if (credits.ContainsKey("cast") && credits["cast"] is JsonArray cast)
                    {
                        foreach (JsonNode starNode in cast)
                        {
                            if (starNode is JsonObject starObject && starObject.ContainsKey("profile_path"))
                            {
                                var profilePath = starObject["profile_path"]?.ToString();
                                if (!string.IsNullOrEmpty(profilePath))
                                {
                                    starObject["profile_path"] = $"https://image.tmdb.org/t/p/w500{profilePath}";
                                }
                            }
                            // Create a new JsonObject instance and add it to castArray
                            var newStarNode = new JsonObject();
                            foreach (var property in starNode?.AsObject() ?? Enumerable.Empty<KeyValuePair<string, JsonNode>>())
                            {
                                if (property.Value != null)
                                {
                                    newStarNode[property.Key] = property.Value.DeepClone(); // Clone the property value if it's not null
                                }
                                else
                                {
                                    newStarNode[property.Key] = null; // Set the property value to null if it's null
                                }
                            }
                            castArray.Add(newStarNode);
                        }
                        details["cast"] = castArray;
                    }

                    var crewArray = new JsonArray();
                    if (credits.ContainsKey("crew") && credits["crew"] is JsonArray crew)
                    {
                        foreach (JsonNode crewNode in crew)
                        {
                            if (crewNode is JsonObject crewObject && crewObject.ContainsKey("profile_path"))
                            {
                                var profilePath = crewObject["profile_path"]?.ToString();
                                if (!string.IsNullOrEmpty(profilePath))
                                {
                                    crewObject["profile_path"] = $"https://image.tmdb.org/t/p/w500{profilePath}";
                                }
                            }
                            // Create a new JsonObject instance and add it to crewArray
                            var newCrewNode = new JsonObject();
                            foreach (var property in crewNode?.AsObject() ?? Enumerable.Empty<KeyValuePair<string, JsonNode>>())
                            {
                                if (property.Value != null)
                                {
                                    newCrewNode[property.Key] = property.Value.DeepClone(); // Clone the property value if it's not null
                                }
                                else
                                {
                                    newCrewNode[property.Key] = null; // Set the property value to null if it's null
                                }
                            }
                            crewArray.Add(newCrewNode);
                        }
                        details["crew"] = crewArray;
                    }
                }
                return details;
            }
            catch (Exception ex)
            {
                // Handle or log the exception appropriately
                Console.WriteLine($"An error occurred while fetching movie details: {ex.Message}");
                throw; // Rethrow the exception to propagate it up the call stack
            }
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
        public async Task<JsonNode> GetSeasonsDetailsAsync([FromQuery] int id, [FromQuery] int season_number, [FromQuery] string Language)
        {
            var options = new RestClientOptions($"https://api.themoviedb.org/3/tv/{id}/season/{season_number}?api_key={_apiKey}&language={Language}");
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
        public async Task<JsonNode> GetEpisodeDetailsAsync([FromQuery] int id, [FromQuery] int season_number, [FromQuery] int episode_number, [FromQuery] string Language)
        {
            var options = new RestClientOptions(
                $"https://api.themoviedb.org/3/tv/{id}/season/{season_number}/episode/{episode_number}?api_key={_apiKey}&language={Language}"
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
        public async Task<JsonNode> GetCollectionDetailsAsync([FromQuery] int id, [FromQuery] string Language)
        {
            var options = new RestClientOptions(
                $"https://api.themoviedb.org/3/collection/{id}?api_key={_apiKey}&language={Language}"
            );
            var client = new RestClient(options);
            var request = new RestRequest("");
            var response = await client.GetAsync(request);
            var collection = JsonNode.Parse(response.Content)?.AsObject();
    
            if (collection != null)
            {
                if(collection["poster_path"]!=null)
                {
                    collection["poster_path"] = $"https://image.tmdb.org/t/p/w500{collection["poster_path"]}";
                }
                if(collection["backdrop_path"]!=null)
                {
                    collection["backdrop_path"] = $"https://image.tmdb.org/t/p/w500{collection["backdrop_path"]}";
                }
                foreach (var part in collection["parts"].AsArray())
                {
                    part["poster_path"] = $"https://image.tmdb.org/t/p/w500{part["poster_path"]}";
                    part["backdrop_path"] = $"https://image.tmdb.org/t/p/w500{part["backdrop_path"]}";
                }
            }
            return collection;
        }
        public async Task<JsonNode> GetPersonDetailsAsync([FromQuery] int id, [FromQuery] string Language)
        {
            var options = new RestClientOptions(
                $"https://api.themoviedb.org/3/person/{id}?api_key={_apiKey}&language={Language}"
            );
            var client = new RestClient(options);
            var request = new RestRequest("");
            var response = await client.GetAsync(request);
            var person = JsonNode.Parse(response.Content)?.AsObject();
    
            if (person != null)
            {
                if(person["profile_path"]!=null)
                {
                    person["profile_path"] = $"https://image.tmdb.org/t/p/w500{person["profile_path"]}";
                }
            }
            var tvCreditsOptions = new RestClientOptions(
                $"https://api.themoviedb.org/3/person/{id}/tv_credits?api_key={_apiKey}&language={Language}"
            );
            var tvCreditsClient = new RestClient(tvCreditsOptions);
            var tvCreditsRequest = new RestRequest("");
            var tvCreditsResponse = await tvCreditsClient.GetAsync(tvCreditsRequest);
            var tvCredits = JsonNode.Parse(tvCreditsResponse.Content)?.AsObject();

            if (tvCredits != null && tvCredits.ContainsKey("cast") && tvCredits["cast"] is JsonArray tvCast)
            {
                var tvCastArray = new JsonArray();
                foreach (JsonNode tvCastNode in tvCast)
                {
                    if (tvCastNode is JsonObject tvCastObject)
                    {
                        if(tvCastObject.ContainsKey("backdrop_path"))
                        {
                            var backdropPath = tvCastObject["backdrop_path"]?.ToString();
                            if (!string.IsNullOrEmpty(backdropPath))
                            {
                                tvCastObject["backdrop_path"] = $"https://image.tmdb.org/t/p/w500{backdropPath}";
                            }
                        }
                        if(tvCastObject.ContainsKey("poster_path"))
                        {
                            var posterPath = tvCastObject["poster_path"]?.ToString();
                            if (!string.IsNullOrEmpty(posterPath))
                            {
                                tvCastObject["poster_path"] = $"https://image.tmdb.org/t/p/w500{posterPath}";
                            }
                        }
                        tvCastObject["media_type"] = "tv";
                    }
                    // Create a new JsonObject instance for tvCastNode
                    var newTvCastNode = new JsonObject();
                    foreach (var property in tvCastNode?.AsObject() ?? Enumerable.Empty<KeyValuePair<string, JsonNode>>())
                    {
                        if (property.Value != null)
                        {
                            newTvCastNode[property.Key] = property.Value.DeepClone(); // Clone the property value if it's not null
                        }
                        else
                        {
                            newTvCastNode[property.Key] = null; // Set the property value to null if it's null
                        }
                    }
                    tvCastArray.Add(newTvCastNode);
                }
                person["tv_cast"] = tvCastArray;
            }

            var movieCreditsOptions = new RestClientOptions(
                $"https://api.themoviedb.org/3/person/{id}/movie_credits?api_key={_apiKey}&language={Language}"
            );
            var movieCreditsClient = new RestClient(movieCreditsOptions);
            var movieCreditsRequest = new RestRequest("");
            var movieCreditsResponse = await movieCreditsClient.GetAsync(movieCreditsRequest);
            var movieCredits = JsonNode.Parse(movieCreditsResponse.Content)?.AsObject();
            if (movieCredits != null && movieCredits.ContainsKey("cast") && movieCredits["cast"] is JsonArray movieCast)
            {
                var movieCastArray = new JsonArray();
                foreach (JsonNode movieCastNode in movieCast)
                {
                    if (movieCastNode is JsonObject movieCastObject)
                    {
                        if(movieCastObject.ContainsKey("backdrop_path"))
                        {
                            var backdropPath = movieCastObject["backdrop_path"]?.ToString();
                            if (!string.IsNullOrEmpty(backdropPath))
                            {
                                movieCastObject["backdrop_path"] = $"https://image.tmdb.org/t/p/w500{backdropPath}";
                            }
                        }
                        if(movieCastObject.ContainsKey("poster_path"))
                        {
                            var posterPath = movieCastObject["poster_path"]?.ToString();
                            if (!string.IsNullOrEmpty(posterPath))
                            {
                                movieCastObject["poster_path"] = $"https://image.tmdb.org/t/p/w500{posterPath}";
                            }
                        }
                        movieCastObject["media_type"] = "movie";
                    }
                    // Create a new JsonObject instance for movieCastNode
                    var newMovieCastNode = new JsonObject();
                    foreach (var property in movieCastNode?.AsObject() ?? Enumerable.Empty<KeyValuePair<string, JsonNode>>())
                    {
                        if (property.Value != null)
                        {
                            newMovieCastNode[property.Key] = property.Value.DeepClone(); // Clone the property value if it's not null
                        }
                        else
                        {
                            newMovieCastNode[property.Key] = null; // Set the property value to null if it's null
                        }
                    }
                    movieCastArray.Add(newMovieCastNode);
                }
                person["movie_cast"] = movieCastArray;
            }

            return person;
        }
    }
}