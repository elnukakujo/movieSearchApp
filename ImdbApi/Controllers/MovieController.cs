using IMDbApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Net.Http;
using System.Threading.Tasks;

namespace IMDbApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IMDbDataController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public IMDbDataController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("download")]
        public async Task<IActionResult> DownloadAndParseData()
        {
            var client = _httpClientFactory.CreateClient();
            var url = "https://datasets.imdbws.com/title.basics.tsv.gz";
            HttpResponseMessage response;

            try
            {
                response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, response.ReasonPhrase);
                }
            }
            catch (HttpRequestException e)
            {
                return StatusCode(500, $"Error fetching data: {e.Message}");
            }

            try
            {
                await using var stream = await response.Content.ReadAsStreamAsync();
                await using var decompressedStream = new GZipStream(stream, CompressionMode.Decompress);
                using var reader = new StreamReader(decompressedStream);

                CreateDatabaseAndTable();

                await ProcessFileInChunks(reader);

                return Ok("Data processed successfully.");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Error processing data: {e.Message}");
            }
        }
        private void CreateDatabaseAndTable()
        {
            string connectionString = "Data Source=movies.db"; // Update with your actual database path
            using var connection = new SqliteConnection(connectionString);
            connection.Open();
    
            var command = connection.CreateCommand();
            command.CommandText = @"
                CREATE TABLE IF NOT EXISTS Movies (
                    Tconst TEXT PRIMARY KEY,
                    TitleType TEXT,
                    PrimaryTitle TEXT,
                    OriginalTitle TEXT,
                    IsAdult INTEGER,
                    StartYear INTEGER,
                    EndYear INTEGER,
                    RuntimeMinutes INTEGER,
                    Genres TEXT
                )";
            command.ExecuteNonQuery();
        }
    
        private async Task ProcessFileInChunks(StreamReader reader)
        {
            string connectionString = "Data Source=movies.db"; // Update with your actual database path
            using var connection = new SqliteConnection(connectionString);
            await connection.OpenAsync();

            var transaction = connection.BeginTransaction();
            var command = connection.CreateCommand();
            command.Transaction = transaction;

            command.CommandText = @"
                INSERT OR IGNORE INTO Movies (Tconst, TitleType, PrimaryTitle, OriginalTitle, IsAdult, StartYear, EndYear, RuntimeMinutes, Genres) 
                VALUES (@Tconst, @TitleType, @PrimaryTitle, @OriginalTitle, @IsAdult, @StartYear, @EndYear, @RuntimeMinutes, @Genres)";

            int batchSize = 1000;
            int currentBatch = 0;

            // Skip headers
            await reader.ReadLineAsync();

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                var values = line.Split('\t');
                if (values.Length < 9) continue;

                try
                {
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@Tconst", values[0]);
                    command.Parameters.AddWithValue("@TitleType", values[1]);
                    command.Parameters.AddWithValue("@PrimaryTitle", values[2]);
                    command.Parameters.AddWithValue("@OriginalTitle", values[3]);
                    command.Parameters.AddWithValue("@IsAdult", values[4] == "1" ? 1 : 0);
                    command.Parameters.AddWithValue("@StartYear", ParseIntValue(values[5]));
                    command.Parameters.AddWithValue("@EndYear", ParseIntValue(values[6]));
                    command.Parameters.AddWithValue("@RuntimeMinutes", ParseIntValue(values[7]));
                    command.Parameters.AddWithValue("@Genres", ParseGenresValue(values[8]));

                    await command.ExecuteNonQueryAsync();

                    currentBatch++;

                    if (currentBatch >= batchSize)
                    {
                        await transaction.CommitAsync();
                        transaction = connection.BeginTransaction();
                        command.Transaction = transaction;
                        currentBatch = 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error inserting line: {ex.Message}");
                    Console.WriteLine($"Values: Tconst={values[0]}, TitleType={values[1]}, PrimaryTitle={values[2]}, ...");
                    System.Environment.Exit(1);
                }
            }

            await transaction.CommitAsync();
        }

        private int? ParseIntValue(string value)
        {
            if (value == @"\N" || string.IsNullOrEmpty(value.Trim()))
            {
                return null;
            }

            return int.TryParse(value, out var result) ? result : (int?)null;
        }

        private object ParseGenresValue(string value)
        {
            if (value == @"\N")
            {
                return DBNull.Value;
            }

            // Assuming genres are stored as string array in the database
            var genres = value.Split(',');
            return string.Join(",", genres.Take(3)); // Limit to first three genres as per IMDb dataset
        }
    }
}