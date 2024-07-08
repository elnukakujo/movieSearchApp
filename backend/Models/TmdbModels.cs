using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Trending
    {
        public required string BackgroundImagePath { get; set; }
        public required int Id { get; set; }
        public required string Title { get; set; }
        public required string OriginalTitle { get; set; }
        public required string Overview { get; set; }
        public required string PosterImagePath {get; set;}
        public required bool IsMovie { get; set; }
        public required bool IsAdult {get; set;}
        public required string OriginalLanguage { get; set; }
        public required List<String> Genres {get; set;}
        public double Popularity { get; set; }
        public DateOnly ReleaseDate {get; set;}
        public double VoteAverage { get; set; }
        public int? VoteCount { get; set; }
        public string? OriginCountry { get; set; }
    }
}