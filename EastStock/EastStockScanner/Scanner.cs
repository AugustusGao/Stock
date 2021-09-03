using EastStockScanner.Dto;
using log4net;
using Microsoft.Playwright;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EastStockScanner
{
    public partial class Scanner : Form
    {
        private ILog logger = LogManager.GetLogger(typeof(Scanner));
        private string chromePath = @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe";
        private IPlaywright playwright;
        public Scanner()
        {
            InitializeComponent();
        }

        private void btn_Start_Click(object sender, EventArgs e)
        {
            Task.Factory.StartNew(() =>
            {
                var res = Login().GetAwaiter().GetResult();
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
                var localUrl = Regex.Split(response.Url, "api")[0];
                var text = await response.TextAsync();
                var networkCookies = await page.Context.CookiesAsync(new[] { "http://quote.eastmoney.com" });
                string cookieStr = networkCookies.Aggregate("", (current, ck) => current + (ck.Name + "=" + ck.Value + ","));

                return new LoginResult() { Cookie = cookieStr, LocalUrl = localUrl, Page = page };
            }
            catch (Exception e)
            {
                logger.Error(e.ToString());
            }
            return null;
        }

        private void Scanner_FormClosed(object sender, FormClosedEventArgs e)
        {
            playwright?.Dispose();
        }
    }
}
