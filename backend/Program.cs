using backend;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;
string apiKey = configuration["TMDB_API_KEY"];
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<TmdbService>();
builder.Services.AddTransient<TmdbService>();

builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            builder => builder.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader());
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.MapControllers(); // Maps all controllers to endpoints

app.Run();