using EastStockScanner.Dto;
using log4net;
using ML.EGP.Sport.Common.DBWorker;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace EastStockScanner
{
    public class StockItem
    {
        private ILog logger = LogManager.GetLogger(typeof(StockItem));
        private string chromePath = System.Environment.CurrentDirectory + @"\chromium-854489\chrome-win\chrome.exe";
        private string stockLogFilePath;
        private Random random = new Random();
        private string sseUrl;
        private bool isClosed = false;
        private string name;
        private float highSale = float.MinValue;
        private float b1HighSale = float.MinValue;
        private double totalValue;
        private float b1Count;
        private SaleStatus saleStatus;
        public string StockCode;
        public StockItem(string n, string stockCode)
        {
            name = n;
            StockCode = stockCode;
            sseUrl = "http://{0}.push2.eastmoney.com/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f206,f207,f208,f209,f210,f211,f212,f213,f214,f215,f86,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f292&secid=" + stockCode;
            var dtStr = DateTime.Now.ToString("yyyyMMdd");
            var directoryPath = System.Environment.CurrentDirectory + "\\StockLog\\" + dtStr;
            if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);
            stockLogFilePath = directoryPath + "\\" + StockCode + ".txt";
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
                sseUrl = string.Format(sseUrl, num);
                logger.Info("Start to connect... name = " + name + ", " + StockCode);
                Console.WriteLine("Start to connect...  " + name + ", " + (StockCode.StartsWith("0") ? "sz" : "sh") + StockCode.Substring(2));
                var httpClient = new HttpClient();
                using (var streamReader = new StreamReader(await httpClient.GetStreamAsync(sseUrl)))
                {
                    while (!isClosed && !streamReader.EndOfStream)
                    {
                        try
                        {
                            var message = await streamReader.ReadLineAsync();
                            if (string.IsNullOrEmpty(message)) continue;
                            DBWorkerManager.AddAnyDBOperation(DBWorkerTypeEnum.OriginDataLog, () =>
                            {
                                using (StreamWriter sw = new StreamWriter(stockLogFilePath, true))
                                {
                                    sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss fff ") + message);
                                }
                            });

                            var jsonStr = message.Substring(5);
                            var rootDto = JsonConvert.DeserializeObject<RootStockDto>(jsonStr);
                            if (rootDto.data == null) continue;
                            if (double.TryParse(rootDto.data.f116, out double t) && t > 0) totalValue = t;
                            if (float.TryParse(rootDto.data.f51, out float highestSale) && highestSale > 0) highSale = highestSale;
                            if (float.TryParse(rootDto.data.f19, out float b1Sale) && b1Sale > 0) b1HighSale = b1Sale;
                            if (int.TryParse(rootDto.data.f20, out int b) && b > 0) b1Count = b;
                            if (!int.TryParse(rootDto.data.f211, out int b1CountChange)) continue;
                            b1Count += b1CountChange;
                            if (b1Sale <= 0 && b < 0 && b1CountChange <= 0) continue;

                            var debug = $"name = {name}, total = {totalValue}, rise highest sale = {highSale}, buy 1 sale = {b1HighSale}, count = {b1Count}, change count = {b1CountChange}";
                            logger.Debug(debug);
                            //Console.WriteLine(debug);

                            //  当股价刚刚到涨停价时判断是否买入
                            //  总市值超过50亿，并且挂单总额超过5000万可以买入
                            if (b1HighSale >= highSale)
                            {
                                double waitTotalValue = b1Count * 100 * b1HighSale;
                                if (totalValue > 50 * 1000 * 1000 && waitTotalValue < 1 * 1000 * 1000)  //  当前挂单较少低于1亿可排挂单
                                {
                                    //  大单撤出4000手直接卖
                                    if (b1CountChange < -4000)
                                    {
                                        if (saleStatus == SaleStatus.Buy)
                                        {
                                            //  todo 卖出交易
                                            var info = $" - - - Warning Cancel Trade stock name = {name}, code = {StockCode}, waitTotalValue = {waitTotalValue}, totalValue = {totalValue}, countChange = {b1CountChange}";
                                            logger.Info(info);
                                            Console.WriteLine(info);
                                        }
                                        continue;
                                    }

                                    //  买入
                                    if (waitTotalValue > 5000 * 1000)
                                    {
                                        if (saleStatus == SaleStatus.None)
                                        {
                                            saleStatus = SaleStatus.Buy;
                                            //  todo 交易买入
                                            var info = $" + + + Trade stock name = {name}, code = {StockCode}, waitTotalValue = {waitTotalValue}, totalValue = {totalValue}";
                                            logger.Info(info);
                                            Console.WriteLine(info);
                                        }
                                    }
                                    //  卖出
                                    else if (saleStatus == SaleStatus.Buy)
                                    {
                                        saleStatus = SaleStatus.None;
                                        //  todo 交卖出
                                        var info = $" - - - Warning Cancel Trade stock name = {name}, code = {StockCode}, waitTotalValue = {waitTotalValue}, totalValue = {totalValue}";
                                        logger.Info(info);
                                        Console.WriteLine(info);
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.Error(ex.ToString());
                            Console.WriteLine(ex.Message);
                        }
                    }
                }
                logger.Info("End " + StockCode);
            });
        }
    }

    public enum SaleStatus
    {
        None,
        Buy,
        Sale
    }
}
