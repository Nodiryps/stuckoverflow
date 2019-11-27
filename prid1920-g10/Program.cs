using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using prid1920_g10.Helpers;
using prid1920_g10.Models;

namespace prid1920_g10 {
    public class Program {
        public static void Main(string[] args) {
            CreateWebHostBuilder(args).Build().Seed().Run();

        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                    .UseSetting("http_port", "5000")
                    .UseStartup<Startup>();
    }
}
