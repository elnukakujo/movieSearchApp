using System;
using System.IO;
using System.IO.Compression;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using RestSharp;
using System.Runtime.CompilerServices;

namespace TsvToJsonConverter
{
    class Program
    {
        static async Task Main(string[] args)
        {
            const string _apiKey = "add0aff9f47b4ebbe003c595f5d0f3c2";
            var url=$"https://api.themoviedb.org/3/trending/all/day?api_key={_apiKey}";
            Console.WriteLine(url);
            var options = new RestClientOptions(url);
            var client = new RestClient(options);
            var request = new RestRequest("");
            var response = await client.GetAsync(request);

            Console.WriteLine("{0}", response.Content);
        }
    }
}