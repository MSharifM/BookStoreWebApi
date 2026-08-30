using System.Text;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using BookStore.Infrastructure.Identity;
using BookStore.Infrastructure.IoC;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

#region Authentication

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("Jwt");

        var key = jwtSettings["Key"]
                  ?? throw new InvalidOperationException("JWT Key is not configured.");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key)),

            ClockSkew = TimeSpan.Zero
        };
    });

#endregion Authentication

#region Identity

builder.Services.AddIdentity<User, IdentityRole>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredUniqueChars = 0;

        options.User.RequireUniqueEmail = true;
        options.User.AllowedUserNameCharacters = "_+QWERTYUIOPASDFGHJKLZXCVBNM1234567890-qwertyuiopasdfghjklxcvbnm";

        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(20);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>();

#endregion Identity

#region DataBase Context

builder.Services.AddDbContext<ApplicationDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("BookStoreConnection"));
});

#endregion DataBase Context

#region Services

DependencyContainers.RegisterServices(builder.Services);

#endregion Services

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole>>();

    await IdentitySeeder.SeedRolesAsync(roleManager);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();