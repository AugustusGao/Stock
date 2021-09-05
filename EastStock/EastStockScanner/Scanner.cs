using EastStockScanner.Dto;
using log4net;
using Microsoft.Playwright;
using ML.NetComponent.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft;
using Newtonsoft.Json;

namespace EastStockScanner
{
    public partial class Scanner : Form
    {
        private ILog logger = LogManager.GetLogger(typeof(Scanner));
        private string chromePath = @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe";
        private IPlaywright playwright;
        private bool isClosed = false;
        private List<Header> hushenHeaders;
        public Scanner()
        {
            InitializeComponent();
            var json = File.ReadAllText(Application.StartupPath + "\\沪深A股标题.json");
            hushenHeaders = JsonConvert.DeserializeObject<List<Header>>(json);
            Test();
        }
        private void Test()
        {
            var text = File.ReadAllText(Application.StartupPath + "\\1test.txt");
            var startIndex = text.IndexOf("({");
            var data = text.Substring(startIndex + 1, text.Length- startIndex - 3);
            var rootData = JsonConvert.DeserializeObject<RootData>(data);
        }
        private void btn_Start_Click(object sender, EventArgs e)
        {
            Task.Factory.StartNew(async () =>
            {
                var res = await Login();
                var urlBase = res.FirstUrl.Substring(0, res.FirstUrl.Length - 13).Replace("pn=2", "pn={0}");
                do
                {
                    var http = new HttpHelper();
                    for (var i = 1; i <= 10; i++)
                    {
                        var time = ToUnixTimeSpan(DateTime.Now);
                        var url = string.Format(urlBase, i) + time;
                        var item = new HttpItem();
                        item.URL = url;
                        item.Cookie = res.Cookie.TrimEnd(',');

                        var result = await http.GetHtmlAsync(item);
                        logger.Debug(result.Html);
                    }
                    await Task.Delay(500);
                } while (!isClosed);
            });
        }

        private async Task<LoginResult> Login()
        {
            try
            {
                playwright = await Playwright.CreateAsync();
                var chrome = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
                { Headless = false, ExecutablePath = chromePath });
                var context = await chrome.NewContextAsync(new BrowserNewContextOptions()
                { UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36" });
                var page = await context.NewPageAsync();

                //  访问行情中心沪深A股
                var url = "http://quote.eastmoney.com/center/gridlist.html#hs_a_board";
                await page.GotoAsync(url);
                //  调整知道页面
                var index = 2;
                await page.EvaluateAsync($"()=>document.getElementsByClassName('paginate_input')[0].value={index}");
                await page.EvaluateAsync("()=>document.getElementsByClassName('paginte_go')[0].click()");
                var response = await page.WaitForResponseAsync(r => r.Url.Contains("push2.eastmoney.com/api/qt/clist/get"));
                //var localUrl = Regex.Split(response.Url, "api")[0];
                //var text = await response.TextAsync();
                var networkCookies = await page.Context.CookiesAsync(new[] { "http://quote.eastmoney.com" });
                string cookieStr = networkCookies.Aggregate("", (current, ck) => current + (ck.Name + "=" + ck.Value + ","));

                return new LoginResult() { Cookie = cookieStr, FirstUrl = response.Url, Page = page };
            }
            catch (Exception e)
            {
                logger.Error(e.ToString());
            }
            return null;
        }
        private static long ToUnixTimeSpan(DateTime date)
        {
            var startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1)); // 当地时区
            return (long)(date - startTime).TotalMilliseconds; // 相差毫秒数
        }
        private void Scanner_FormClosed(object sender, FormClosedEventArgs e)
        {
            isClosed = true;
            playwright?.Dispose();
        }


    }
}
