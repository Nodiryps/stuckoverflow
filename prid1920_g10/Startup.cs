using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Threading.Tasks;
using prid1920_g10.Models;

namespace prid1920_g10
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the 
        //container.
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddDbContext<G10Context>(opt =>
            //     opt.UseInMemoryDatabase("G10"));
            // services.AddDbContext<G10Context>(opt => 
            //     opt.UseSqlServer(Configuration.GetConnectionString("G10-mssql")));
            services.AddDbContext<G10Context>(opt => {
                opt.UseLazyLoadingProxies();
                opt.UseMySql(Configuration.GetConnectionString("G10-mysql"));
            });
                
            
            services.AddMvc()
            .AddJsonOptions(opt => {
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
   
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => {
                configuration.RootPath = "ClientApp/dist";
            });

            // JWT super secret key
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            // JWT for authentication && checking of authen.
            services.AddAuthentication(x => {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x => {
                // only httpS
                x.RequireHttpsMetadata = true;
                x.SaveToken = true;
                // how to validate the received token
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    // check if it's signed with the key 
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    // not checking the sender
                    ValidateIssuer = false,
                    // not checking the dest.
                    ValidateAudience = false,
                    // check lifetime
                    ValidateLifetime = true,
                    // zero tolerance time validity
                    ClockSkew = TimeSpan.Zero
                };
                // link events to the token
                x.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed  = context => 
                    {
                        // if token expired
                        if(context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            // add to header for the front-end to tell it
                            context.Response.Headers.Add("Token-Expired", "true"); 
                        }
                        return Task.CompletedTask;
                    }
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP 
        //request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for 
                // production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseSpaStaticFiles();
            app.UseAuthentication();
            app.UseMvc(routes => {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
            app.UseSpa(spa => {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment()) {
                    // Utilisez cette ligne si vous voulez que VS lance le front-end angular quand vous démarrez l'app
                    //spa.UseAngularCliServer(npmScript: "start");
                    // Utilisez cette ligne si le front-end angular est exécuté en dehors de VS (ou dans une autre instance de VS)
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
