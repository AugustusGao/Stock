using EastStockScanner.Dto;
using log4net;
using Microsoft.Playwright;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace EastStockScanner
{
    public class StockItem
    {
        private ILog logger = LogManager.GetLogger(typeof(StockItem));
        private string chromePath = System.Environment.CurrentDirectory + @"\chromium-854489\chrome-win\chrome.exe";
        private Random random = new Random();
        private string url;
        private bool isClosed = false;
        public string StockCode;
        public StockItem(string stockCode)
        {
            StockCode = stockCode;
            url = $"http://quote.eastmoney.com/{StockCode}.html";
        }

        public void Stop()
        {
            isClosed = true;
        }
        public void StartWatch()
        {
            Task.Factory.StartNew(async () =>
            {
                var num = random.Next(1, 99);
                var sseUrl = $"http://56.push2.eastmoney.com/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f206,f207,f208,f209,f210,f211,f212,f213,f214,f215,f86,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f292&secid=0.000966";
                ServerEventConnect connectMsg = null;
                var msgs = new List<ServerEventMessage>();
                var commands = new List<ServerEventMessage>();
                var errors = new List<Exception>();
                logger.Info("Start to connect...  " + sseUrl);

                var httpClient = new HttpClient();

                using (var streamReader = new StreamReader(await httpClient.GetStreamAsync(sseUrl)))
                {
                    while (!isClosed && !streamReader.EndOfStream)
                    {
                        var message = await streamReader.ReadLineAsync();
                        logger.Info($"Received message: {message}");
                        Console.WriteLine(message);
                    }
                }
                logger.Info("End");
            });

            //client = new ServerEventsClient(sseUrl)
            //{
            //    OnConnect = e => logger.Info("Connect" + e.Data),
            //    OnCommand = e => logger.Info("OnCommand" + e.Data),
            //    OnMessage = e => logger.Info("OnMessage" + e.Data),
            //    OnException = e => logger.Info("OnException" + e.Data),
            //}.Start();

            logger.Info("Connect finish");
            return;
            Task.Factory.StartNew(async () =>
            {
                var res = await Login();
                var c = res.Cookie;
            });
        }

        private ServerEventsClient client;
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
                //page.Response += Page_Response;
                var response = await page.GotoAsync(url);
                var networkCookies = await page.Context.CookiesAsync(new[] { "http://quote.eastmoney.com" });
                string cookieStr = networkCookies.Aggregate("", (current, ck) => current + (ck.Name + "=" + ck.Value + ","));
                var num = random.Next(1, 99);
                var sseUrl = $"http://{num}.push2.eastmoney.com/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f206,f207,f208,f209,f210,f211,f212,f213,f214,f215,f86,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f292&secid=1.600328";
                ServerEventConnect connectMsg = null;
                var msgs = new List<ServerEventMessage>();
                var commands = new List<ServerEventMessage>();
                var errors = new List<Exception>();
                logger.Info("Start to connect...  " + sseUrl);
                client = new ServerEventsClient(sseUrl)
                {
                    OnConnect = e => logger.Info("Connect" + e.Data),
                    OnCommand = e => logger.Info("OnCommand" + e.Data),
                    OnMessage = e => logger.Info("OnMessage" + e.Data),
                    OnException = e => logger.Info("OnException" + e.Data),
                }.Start();

                logger.Info("Connect finish");
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
