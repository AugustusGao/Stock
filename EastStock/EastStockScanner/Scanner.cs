using EastStockScanner.Dto;
using log4net;
using Microsoft.Playwright;
using ML.NetComponent.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EastStockScanner
{
    public partial class Scanner : Form
    {
        private ILog logger = LogManager.GetLogger(typeof(Scanner));
        private string chromePath = System.Environment.CurrentDirectory + @"\chromium-854489\chrome-win\chrome.exe";
        private IPlaywright playwright;
        private bool isClosed = false;
        private List<Header> hushenHeaders;
        private Dictionary<string, string> headDic;
        public Scanner()
        {
            InitializeComponent();
            Control.CheckForIllegalCrossThreadCalls = false;
            var json = File.ReadAllText(Application.StartupPath + "\\沪深A股标题.json");
            hushenHeaders = JsonConvert.DeserializeObject<List<Header>>(json);
            headDic = hushenHeaders.Where(o => !string.IsNullOrEmpty(o.key)).ToDictionary(o => o.key, o => o.title);
            //Test();
        }
        private void Test()
        {
            var text = File.ReadAllText(Application.StartupPath + "\\1test.txt");
            var startIndex = text.IndexOf("({");
            var data = text.Substring(startIndex + 1, text.Length - startIndex - 3);
            var rootData = JsonConvert.DeserializeObject<RootData>(data);

            for (var i = 1; i <= 1; i++)
            {
                var notKeys = new List<string>();
                var table = new DataTable();
                for (var j = 0; j < 20; j++)
                {
                    var d = rootData.data.diff[j];
                    var dic = GetProperties(d);

                    if (j == 0)
                    {
                        foreach (var key in dic.Keys)
                        {
                            if (!headDic.Keys.Contains(key) || string.IsNullOrEmpty(headDic[key]))
                            {
                                notKeys.Add(key);
                                continue;
                            }
                            table.Columns.Add(headDic[key]);
                        }
                    }
                    var row = table.NewRow();
                    foreach (var kv in dic)
                    {
                        if (notKeys.Contains(kv.Key)) continue;
                        row[headDic[kv.Key]] = kv.Value;
                    }
                    table.Rows.Add(row);
                }

                DataGridView dataGrid;
                var tabPage = GetTabPage(i);
                if (tabPage.Controls.Count == 0)
                {
                    dataGrid = new DataGridView();
                    dataGrid.RowStateChanged += (s, e) => { e.Row.HeaderCell.Value = string.Format("{0}", e.Row.Index + 1); };
                    dataGrid.RowHeadersWidthSizeMode = DataGridViewRowHeadersWidthSizeMode.AutoSizeToAllHeaders;
                    dataGrid.Dock = DockStyle.Fill;
                    tabPage.Controls.Add(dataGrid);
                }
                else
                {
                    dataGrid = (DataGridView)tabPage.Controls[0];
                }
                dataGrid.DataSource = table;
            }
        }
        private void btn_Start_Click(object sender, EventArgs e)
        {
            var si = new StockItem("sz301056");
            si.StartWatch();

            return;



            Task.Factory.StartNew(async () =>
            {
                for (var i = 1; i <= 10; i++)
                {
                    var tabPage = GetTabPage(i);
                    CreateDataGrid(tabPage);
                }

                var res = await Login();
                var urlBase = res.FirstUrl.Substring(0, res.FirstUrl.Length - 13).Replace("pn=2", "pn={0}");
                //do
                //{
                var http = new HttpHelper();
                for (var i = 1; i <= 10; i++)
                {
                    try
                    {
                        var time = ToUnixTimeSpan(DateTime.Now);
                        var url = string.Format(urlBase, i) + time;
                        var item = new HttpItem();
                        item.URL = url;
                        item.Cookie = res.Cookie.TrimEnd(',');

                        var result = await http.GetHtmlAsync(item);
                        if (result.StatusCode != System.Net.HttpStatusCode.OK) return;
                        await Task.Factory.StartNew(() =>
                        {
                            try
                            {
                                var startIndex = result.Html.IndexOf("({");
                                var data = result.Html.Substring(startIndex + 1, result.Html.Length - startIndex - 3);
                                var rootData = JsonConvert.DeserializeObject<RootData>(data);
                                var notKeys = new List<string>();
                                var table = new DataTable();
                                for (var j = 0; j < 20; j++)
                                {
                                    var d = rootData.data.diff[j];
                                    var dic = GetProperties(d);

                                    if (j == 0)
                                    {
                                        var headSort = new List<string>() { "代码", "名称", "相关链接", "最新价", "涨跌幅", "涨跌额", "成交量(手)", "成交额", "振幅", "最高", "最低", "今开", "昨收", "量比", "换手率", "市盈率(动态)", "市净率" };
                                        var headFull = new List<string>();
                                        foreach (var key in dic.Keys)
                                        {
                                            if (!headDic.Keys.Contains(key) || string.IsNullOrEmpty(headDic[key]))
                                            {
                                                notKeys.Add(key);
                                                continue;
                                            }
                                            headFull.Add(headDic[key]);
                                        }
                                        var ext = headFull.Except(headSort);
                                        headSort.AddRange(ext);
                                        headSort.ForEach(k => table.Columns.Add(k));
                                    }
                                    var row = table.NewRow();
                                    foreach (var kv in dic)
                                    {
                                        if (notKeys.Contains(kv.Key)) continue;
                                        row[headDic[kv.Key]] = kv.Value;
                                    }
                                    table.Rows.Add(row);
                                }

                                var tabPage = GetTabPage(i);
                                DataGridView dataGrid = (DataGridView)tabPage.Controls[0];
                                dataGrid.DataSource = table;
                            }
                            catch (Exception exx)
                            {
                                logger.Error("Process Page No = " + i, exx);
                            }
                        });
                    }
                    catch (Exception ex)
                    {
                        logger.Error("Page No = " + i, ex);
                    }
                }
                //    await Task.Delay(5000 * 12);
                //} while (!isClosed);
            });
        }
        private DataGridView CreateDataGrid(TabPage tabPage)
        {
            if (this.InvokeRequired)
            {
                return (DataGridView)this.Invoke(new MethodInvoker(delegate { CreateDataGrid(tabPage); }));
            }
            var dataGrid = new DataGridView();
            dataGrid.RowStateChanged += (s, ee) => { ee.Row.HeaderCell.Value = string.Format("{0}", ee.Row.Index + 1); };
            dataGrid.RowHeadersWidthSizeMode = DataGridViewRowHeadersWidthSizeMode.AutoSizeToAllHeaders;
            dataGrid.Dock = DockStyle.Fill;
            tabPage.Controls.Add(dataGrid);
            return dataGrid;
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
        private TabPage GetTabPage(int number)
        {
            switch (number)
            {
                case 1: return tabPage1;
                case 2: return tabPage2;
                case 3: return tabPage3;
                case 4: return tabPage4;
                case 5: return tabPage5;
                case 6: return tabPage6;
                case 7: return tabPage7;
                case 8: return tabPage8;
                case 9: return tabPage9;
                case 10: return tabPage10;
                default: return null;
            }
        }
        public static Dictionary<string, string> GetProperties<T>(T t)
        {
            Dictionary<string, string> ret = new Dictionary<string, string>();

            if (t == null)
            {
                return null;
            }
            System.Reflection.PropertyInfo[] properties = t.GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);

            if (properties.Length <= 0)
            {
                return null;
            }
            foreach (System.Reflection.PropertyInfo item in properties)
            {
                string name = item.Name;                                         //实体类字段名称
                var value = item.GetValue(t, null);                //该字段的值
                var valueStr = value is float ? DoubleToFullString((float)value, NumberFormatInfo.CurrentInfo) : value.ToString();

                if (item.PropertyType.IsValueType || item.PropertyType.Name.StartsWith("String"))
                {
                    ret.Add(name, valueStr);                                       //在此可转换value的类型
                }
            }

            return ret;
        }
        public static string DoubleToFullString(double value, NumberFormatInfo formatInfo)
        {
            string[] valueExpSplit;
            string result, decimalSeparator;
            int indexOfDecimalSeparator, exp;

            valueExpSplit = value.ToString("r", formatInfo)
                                 .ToUpper()
                                 .Split(new char[] { 'E' });

            if (valueExpSplit.Length > 1)
            {
                result = valueExpSplit[0];
                exp = int.Parse(valueExpSplit[1]);
                decimalSeparator = formatInfo.NumberDecimalSeparator;

                if ((indexOfDecimalSeparator
                     = valueExpSplit[0].IndexOf(decimalSeparator)) > -1)
                {
                    exp -= (result.Length - indexOfDecimalSeparator - 1);
                    result = result.Replace(decimalSeparator, "");
                }

                if (exp >= 0) result += new string('0', Math.Abs(exp));
                else
                {
                    exp = Math.Abs(exp);
                    if (exp >= result.Length)
                    {
                        result = "0." + new string('0', exp - result.Length)
                                     + result;
                    }
                    else
                    {
                        result = result.Insert(result.Length - exp, decimalSeparator);
                    }
                }
            }
            else result = valueExpSplit[0];

            return result;
        }
    }
}
