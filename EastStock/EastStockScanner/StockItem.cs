using EastStockScanner.Dto;
using log4net;
using Microsoft.Playwright;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EastStockScanner
{
    public class StockItem
    {
        private ILog logger = LogManager.GetLogger(typeof(StockItem));
        private string chromePath = System.Environment.CurrentDirectory + @"\chromium-854489\chrome-win\chrome.exe";
        private string url;
        public string StockCode;
        public StockItem(string stockCode)
        {
            StockCode = stockCode;
            url = $"http://quote.eastmoney.com/{StockCode}.html";
        }

        public void StartWatch()
        {
            Task.Factory.StartNew(async () =>
            {
                var res = await Login();
                var c = res.Cookie;
            });
        }

        private async Task<LoginResult> Login()
        {
            try
            {
                var playwright = await Playwright.CreateAsync();
                var chrome = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
                { Headless = false, ExecutablePath = chromePath });
                var context = await chrome.NewContextAsync(new BrowserNewContextOptions()
                { UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36" });
                var page = await context.NewPageAsync();
                page.Response += Page_Response;
                var response = await page.GotoAsync(url);
                var networkCookies = await page.Context.CookiesAsync(new[] { "http://quote.eastmoney.com" });
                string cookieStr = networkCookies.Aggregate("", (current, ck) => current + (ck.Name + "=" + ck.Value + ","));
            }
            catch (Exception e)
            {
                logger.Error(e.ToString());
            }
            return null;
        }

        private async void Page_Response(object sender, IResponse e)
        {
            var text = await e.TextAsync();
            Console.WriteLine(e.Url);
            logger.Info(text);
        }
    }
}
