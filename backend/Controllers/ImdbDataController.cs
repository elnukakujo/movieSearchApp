using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/imdbdata")]
    public class ImdbDataController: ControllerBase
    {
        private const string IMDbUrl = "https://datasets.imdbws.com/title.basics.tsv.gz";
        private int MaxRows; // Adjust as needed
        private readonly HttpClient _httpClient;

        public ImdbDataController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TitleBasics>>> GetTitleBasics([FromQuery] int id)
        {
            if(id <= 0)
            {
                return BadRequest("Please provide a valid number of element to return.");
            }
            MaxRows = id;
            try
            {
                using HttpResponseMessage response = await _httpClient.GetAsync(IMDbUrl, HttpCompletionOption.ResponseHeadersRead);
                using Stream stream = await response.Content.ReadAsStreamAsync();
                using var decompressionStream = new GZipStream(stream, CompressionMode.Decompress);
                using var reader = new StreamReader(decompressionStream);

                List<TitleBasics> titles = new List<TitleBasics>();
                string headerLine = await reader.ReadLineAsync(); // Read the header line
                string line;
                int rowCount = 0;

                while ((line = await reader.ReadLineAsync()) != null && rowCount < MaxRows)
                {
                    string[] values = line.Split('\t');
                    if (values.Length >= 9)
                    {
                        TitleBasics title = new TitleBasics
                        {
                            Tconst = values[0],
                            TitleType = values[1],
                            PrimaryTitle = values[2],
                            OriginalTitle = values[3],
                            IsAdult = values[4] == "1",
                            StartYear = Convert.ToInt32(values[5]),
                            EndYear = values[6] == "\\N" ? null : values[6],
                            RuntimeMinutes = values[7] == "\\N" ? null : (int?)Convert.ToInt32(values[7]),
                            Genres = values[8].Split(',')
                        };

                        titles.Add(title);
                        rowCount++;
                    }
                }

                return Ok(titles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}