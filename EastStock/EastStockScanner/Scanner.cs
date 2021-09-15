using EastStockScanner.Dto;
using log4net;
using Microsoft.Playwright;
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

        private TextBoxWriter tw;
        private IPlaywright playwright;
        private bool isClosed = false;
        private Quote quote;
        private StockItem stockItem;
        private List<Header> hushenHeaders;
        private Dictionary<string, string> headDic;
        private Dictionary<string, StockItem> dicStockItems = new Dictionary<string, StockItem>();
        private DateTime openTimeAM;
        private DateTime closeTimeAM;
        private DateTime openTimePM;
        private DateTime closeTimePM;
        public Scanner()
        {
            InitializeComponent();

            tw = new TextBoxWriter(textBox1, textBox2);
            Console.SetOut(tw);
            Control.CheckForIllegalCrossThreadCalls = false;

            //  开闭市时间
            var now = DateTime.Now;
            openTimeAM = new DateTime(now.Year, now.Month, now.Day, 9, 30, 0);
            closeTimeAM = new DateTime(now.Year, now.Month, now.Day, 11, 30, 0);
            openTimePM = new DateTime(now.Year, now.Month, now.Day, 13, 0, 0);
            closeTimePM = new DateTime(now.Year, now.Month, now.Day, 15, 0, 0);

            var json = File.ReadAllText(Application.StartupPath + "\\沪深A股标题.json");
            hushenHeaders = JsonConvert.DeserializeObject<List<Header>>(json);
            headDic = hushenHeaders.Where(o => !string.IsNullOrEmpty(o.key)).ToDictionary(o => o.key, o => o.title);
            //Test();
        }
        private void Test()
        {
            var text = File.ReadAllText(Application.StartupPath + "\\1test.txt");
            //var jsonStr = text.Substring(5);
            //var ss = JsonConvert.DeserializeObject<RootStockDto>(jsonStr);
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
            quote = new Quote();
            quote.StockWatchAction = (name, stockCode) =>
            {
                if (dicStockItems.ContainsKey(stockCode)) return;
                var si = new StockItem(name, stockCode);
                si.StartWatch();
                dicStockItems.Add(si.StockCode, si);
            };
            quote.StartScanning();

            //  定时检查每个股票数据是否一直更新
            var checkSeconds = 10;
            Task.Factory.StartNew(async () =>
           {
               do
               {
                   var now = DateTime.Now;
                   if (now > openTimeAM && now < closeTimeAM || now > openTimePM && now < closeTimePM)
                   {
                       checkSeconds = 4;
                   }
                   else
                   {
                       checkSeconds = 10;
                   }

                   foreach (var value in dicStockItems.Values)
                   {
                       if ((DateTime.Now - value.UpdateTime).TotalSeconds > checkSeconds)
                       {
                           value.Stop();
                           value.StartWatch(true);
                       }
                   }

                   await Task.Delay(200);
               } while (!isClosed);
           });
        }
        private void Scanner_FormClosed(object sender, FormClosedEventArgs e)
        {
            try
            {
                isClosed = true;
                foreach (var item in dicStockItems.Values)
                {
                    item.Stop();
                }
                quote?.StopScanning();
                playwright?.Dispose();
                Environment.Exit(Environment.ExitCode);
            }
            catch (Exception)
            {
            }
        }
        private TabPage GetTabPage(int number)
        {
            return null;
            //switch (number)
            //{
            //    case 1: return tabPage1;
            //    case 2: return tabPage2;
            //    case 3: return tabPage3;
            //    case 4: return tabPage4;
            //    case 5: return tabPage5;
            //    case 6: return tabPage6;
            //    case 7: return tabPage7;
            //    case 8: return tabPage8;
            //    case 9: return tabPage9;
            //    case 10: return tabPage10;
            //    default: return null;
            //}
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
    public class TextBoxWriter : System.IO.TextWriter
    {
        private TextBox tbox1;
        private TextBox tbox2;
        private delegate void VoidAction();
        private string searchKey = null;

        public TextBoxWriter(TextBox box1, TextBox box2)
        {
            tbox1 = box1;
            tbox2 = box2;
        }

        public override void Write(string value)
        {
            VoidAction action = delegate
            {
                try
                {
                    tbox1.AppendText(value);
                }
                catch (Exception)
                {
                }
            };
            try
            {
                tbox1.BeginInvoke(action);
            }
            catch (Exception)
            {

            }
        }

        public override void WriteLine(string value)
        {
            try
            {
                if (value.Contains("msg|"))
                {
                    VoidAction actionBox2 = delegate
                    {
                        try
                        {
                            if (value.Contains("msg|")) tbox2.AppendText(value.Substring(4) + "\r\n");
                        }
                        catch (Exception)
                        {
                        }
                    };
                    tbox2.BeginInvoke(actionBox2);
                }
                else
                {
                    VoidAction actionBox1 = delegate
                    {
                        try
                        {
                            if (!string.IsNullOrEmpty(searchKey) && !value.Contains(searchKey)) return;
                            if (tbox1.Lines.Length > 50) tbox1.Clear();
                            tbox1.AppendText(value + "\r\n");
                        }
                        catch (Exception)
                        {
                        }
                    };
                    tbox1.BeginInvoke(actionBox1);
                }
            }
            catch (Exception)
            {
            }
        }

        public override System.Text.Encoding Encoding
        {
            get { return System.Text.Encoding.UTF8; }
        }

        public void SetSearchKey(string key)
        {
            searchKey = key;
        }
    }
}
