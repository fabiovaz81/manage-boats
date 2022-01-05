using Amazon.S3;
using BoatLux.Application.Interfaces;
using BoatLux.Application.Services;
using BoatLux.Application.UseCases;
using BoatLux.Domain.Interfaces;
using BoatLux.Infra.Context;
using BoatLux.Infra.Options;
using BoatLux.Infra.Repositories;
using BoatLux.Infra.Subscribers.Iugu;
using BoatLux.Infra.Subscribers.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;

namespace BoatLux.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options =>
            {
                options.AddPolicy("EnableCORS", builder =>
                {
                    builder.AllowAnyOrigin()
                       .AllowAnyHeader()
                       .AllowAnyMethod();
                });
            });

            services.AddControllers();

            services.AddSingleton(Configuration);

            services.AddOptions();
            services.Configure<MyAppSettings>(Configuration.GetSection("MyAppSettings"));

            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ILoginRepository, LoginRepository>();
            services.AddScoped<ILoginUseCase, LoginUseCase>();
            services.AddScoped<IFinanceiroRepository, FinanceiroRepository>();
            services.AddScoped<IFinanceiroUseCase, FinanceiroUseCase>();
            services.AddScoped<IBuscaRapidaRepository, BuscaRapidaRepository>();
            services.AddScoped<IBuscaRapidaUseCase, BuscaRapidaUseCase>();
            services.AddScoped<ISubscribe, FaturaSubscribe>();
            services.AddScoped<IS3Service, S3Service>();

            services.AddAWSService<IAmazonS3>();
            var options = Configuration.GetAWSOptions();
            IAmazonS3 client = options.CreateServiceClient<IAmazonS3>();

            services.AddDbContext<DBContext>(options => options.UseMySql(Configuration.GetSection("MyAppSettings:ConnString").Value));

            #region Auth Token

            var key = Encoding.ASCII.GetBytes(Configuration.GetSection("MyAppSettings:Secret").Value);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                };
            });
            IdentityModelEventSource.ShowPII = true;
            #endregion

            services.AddSwaggerGen(s =>
            {
                s.SwaggerDoc("v1", new OpenApiInfo { Title = "Api Boat Lux", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("EnableCORS");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();

            app.UseSwaggerUI(s =>
            {
                s.SwaggerEndpoint("/swagger/v1/swagger.json", "Boat Lux Api");
            });
        }
    }
}