using System;
using System.IO;
using System.IO.Compression;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TsvToJsonConverter
{
    class Program
    {
        static async Task Main(string[] args)
        {
            const string url = "https://datasets.imdbws.com/title.basics.tsv.gz";
            const int maxRows = 5;
            const string outputFileName = "title.basics.json";

            using HttpClient client = new HttpClient();
            using HttpResponseMessage response = await client.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
            using Stream stream = await response.Content.ReadAsStreamAsync();
            using GZipStream decompressionStream = new GZipStream(stream, CompressionMode.Decompress);
            using StreamReader reader = new StreamReader(decompressionStream);

            using FileStream fs = new FileStream(outputFileName, FileMode.Create, FileAccess.Write);
            using Utf8JsonWriter writer = new Utf8JsonWriter(fs, new JsonWriterOptions { Indented = true });

            writer.WriteStartArray();

            string headerLine = await reader.ReadLineAsync(); // Read the header line
            string line;
            int rowCount = 0;

            while ((line = await reader.ReadLineAsync()) != null && rowCount < maxRows)
            {
                string[] values = line.Split('\t');
                if (values.Length > 0)
                {
                    if (rowCount > 0)
                    {
                        writer.Flush();
                    }

                    writer.WriteStartObject();

                    for (int i = 0; i < values.Length; i++)
                    {
                        writer.WriteString($"column_{i + 1}", values[i]);
                    }

                    writer.WriteEndObject();

                    rowCount++;

                    if (rowCount % 10000 == 0)
                    {
                        Console.WriteLine($"Processed {rowCount} rows...");
                    }
                }
            }

            writer.WriteEndArray();
            writer.Flush();

            Console.WriteLine($"Conversion complete. {rowCount} rows processed. The data is saved in '{outputFileName}'.");
        }
    }
}