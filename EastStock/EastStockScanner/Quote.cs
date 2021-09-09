using EastStockScanner.Dto;
using log4net;
using Microsoft.Playwright;
using ML.NetComponent.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EastStockScanner
{
    public class Quote
    {
        private ILog logger = LogManager.GetLogger(typeof(Quote));
        private string chromePath = System.Environment.CurrentDirectory + @"\chromium-854489\chrome-win\chrome.exe";
        private bool isStart = false;
        private bool isLoginSuccess = false;
        private string risePercentRange;
        private List<string> headSort;
        private LoginResult loginResult;
        private Dictionary<string, string> headDic;
        private IPlaywright playwright;
        private Dictionary<string, string> dicStockWatching;
        public Action<string, string> StockWatchAction = null;

        public Quote()
        {
            risePercentRange = "9.9,10.5";
            dicStockWatching = new Dictionary<string, string>();
            headSort = new List<string>() { "代码", "名称", "相关链接", "最新价", "涨跌幅", "涨跌额", "成交量(手)", "成交额", "振幅", "最高", "最低", "今开", "昨收", "量比", "换手率", "市盈率(动态)", "市净率" };
            var json = File.ReadAllText(Application.StartupPath + "\\沪深A股标题.json");
            var hushenHeaders = JsonConvert.DeserializeObject<List<Header>>(json);
            headDic = hushenHeaders.Where(o => !string.IsNullOrEmpty(o.key)).ToDictionary(o => o.key, o => o.title);
        }
        private async Task<LoginResult> Login()
        {
            try
            {
                playwright = await Playwright.CreateAsync();
                var chrome = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
                { Headless = true, ExecutablePath = chromePath });
                var context = await chrome.NewContextAsync(new BrowserNewContextOptions()
                { UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36" });
                var page = await context.NewPageAsync();

                //  访问行情中心沪深A股
                var url = "http://quote.eastmoney.com/center/gridlist.html#hs_a_board";
                await page.GotoAsync(url);
                var index = 2;
                await page.EvaluateAsync($"()=>document.getElementsByClassName('paginate_input')[0].value={index}");
                await page.EvaluateAsync("()=>document.getElementsByClassName('paginte_go')[0].click()");
                var response = await page.WaitForResponseAsync(r => r.Url.Contains("push2.eastmoney.com/api/qt/clist/get"));
                //var localUrl = Regex.Split(response.Url, "api")[0];
                //var text = await response.TextAsync();
                var networkCookies = await page.Context.CookiesAsync(new[] { "http://quote.eastmoney.com" });
                string cookieStr = networkCookies.Aggregate("", (current, ck) => current + (ck.Name + "=" + ck.Value + ","));
                isLoginSuccess = true;
                return new LoginResult() { Cookie = cookieStr, FirstUrl = response.Url, Page = page };
            }
            catch (Exception ex)
            {
                Console.WriteLine("Login Failed " + ex.Message);
            }
            return null;
        }

        public void StartScanning()
        {
            isStart = true;
            var arr = risePercentRange.Split(',');
            var riseLowest = float.Parse(arr[0]);
            var riseHighest = float.Parse(arr[1]);
            Task.Factory.StartNew(async () =>
            {
                do
                {
                    if (!isLoginSuccess) loginResult = await Login();
                    if (!isLoginSuccess)
                    {
                        await Task.Delay(500);
                        continue;
                    }

                    var urlBase = loginResult.FirstUrl.Substring(0, loginResult.FirstUrl.Length - 13).Replace("pn=2", "pn={0}");
                    var http = new HttpHelper();
                    for (var i = 1; i <= 10; i++)
                    {
                        try
                        {
                            var time = ToUnixTimeSpan(DateTime.Now);
                            var url = string.Format(urlBase, i) + time;
                            var item = new HttpItem();
                            item.URL = url;
                            item.Cookie = loginResult.Cookie.TrimEnd(',');
                            var result = await http.GetHtmlAsync(item);
                            if (result.StatusCode != System.Net.HttpStatusCode.OK) continue;

                            //  处理数据
                            var startIndex = result.Html.IndexOf("({");
                            if (startIndex < 0)
                            {
                                logger.Debug("Cannot parse data = " + result.Html);
                                continue;
                            }
                            var data = result.Html.Substring(startIndex + 1, result.Html.Length - startIndex - 3);
                            var rootData = JsonConvert.DeserializeObject<RootData>(data);
                            if (rootData == null) continue;

                            //  检查00,60开头股票，涨幅接近目标范围的股票
                            //  f3:涨跌幅, f14:名称, f12:代码, f13:(深圳,上海)(0,1)
                            foreach (var d in rootData.data.diff)
                            {
                                var f3 = float.Parse(d.f3);
                                if (f3 > riseLowest && f3 < riseHighest)
                                {
                                    if (d.f12.StartsWith("00") || d.f12.StartsWith("60"))
                                    {
                                        if (!int.TryParse(d.f13, out int f13)) continue;
                                        var code = (f13 == 0 ? "sz" : "sh") + d.f12;
                                        if (dicStockWatching.ContainsKey(code)) continue;
                                        dicStockWatching.Add(code, code);
                                        StockWatchAction?.Invoke(d.f14, d.f13 + "." + d.f12);
                                        var info = $"Start stock watch name = {d.f14}, code = {code}, rise = {d.f3}";
                                        logger.Info(info);
                                        //Console.WriteLine(info);
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.Error("Page No = " + i, ex);
                        }
                    }

                    await Task.Delay(2000);
                } while (isStart);
                logger.Error("Exist StartScanning");
            });
        }

        public void StopScanning()
        {
            isStart = false;
            playwright?.Dispose();
        }


        private static long ToUnixTimeSpan(DateTime date)
        {
            var startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1)); // 当地时区
            return (long)(date - startTime).TotalMilliseconds; // 相差毫秒数
        }
    }
}
