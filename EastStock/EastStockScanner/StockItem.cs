using EastStockScanner.Dto;
using log4net;
using ML.EGP.Sport.Common.DBWorker;
using Newtonsoft.Json;
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
        private string stockLogFilePath;
        private Random random = new Random();
        private string sseUrl;
        private bool isClosed = false;
        private string name;
        private float highSale = float.MinValue;
        private float b1HighSale = float.MinValue;
        private float? b1FirstSale = null;
        private double totalValue;
        private double tradeInValueCheck;
        private double bigTradeOutValueCheck;
        private int[] b1CountChangeRecords = new int[10];
        private int recordeIndex = 0;
        private int b1Count;
        private DateTime becomeHighSaleTime = DateTime.MaxValue;
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
                            if (double.TryParse(rootDto.data.f116, out double t) && t > 0)
                            {
                                totalValue = t;
                                //  市值低于10亿的不考虑
                                if (totalValue < 10 * 10000 * 10000)
                                {
                                    logger.Info($"Cancel watch totalValue too lower ,name = {name}, code = {StockCode}, b1FirstSale = {b1FirstSale}");
                                    Stop();
                                    continue;
                                }
                                //  1%且不能超过1亿，超过1亿强制设定为1亿
                                //tradeInValueCheck = totalValue * 0.01;
                                //  总市值  <50亿:5000万， >50亿且<100亿:8000万，>100亿:1亿
                                if (totalValue < 50.0 * 10000 * 10000) tradeInValueCheck = 5000 * 10000;
                                else if (totalValue < 100.0 * 10000 * 10000) tradeInValueCheck = 8000 * 10000;
                                else tradeInValueCheck = 1 * 10000 * 10000;
                                tradeInValueCheck /= 2.0;
                                //bigTradeOutValueCheck = tradeInValueCheck * 0.05;   //  5%
                            }
                            if (float.TryParse(rootDto.data.f51, out float highestSale) && highestSale > 0) highSale = highestSale;
                            if (float.TryParse(rootDto.data.f19, out float b1Sale) && b1Sale > 0)
                            {
                                //  股价大于20的股票不考虑
                                if (b1Sale > 20)
                                {
                                    logger.Debug($"Cancel watch b1Sale > 20.0 ,name = {name}, code = {StockCode}, b1FirstSale = {b1FirstSale ?? b1Sale}");
                                    Stop();
                                    continue;
                                }
                                //  拿到数据就已经是涨停价的，不再监测挂单买入
                                if (Math.Abs(highSale - (b1FirstSale ?? b1Sale)) < 0.0001)
                                {
                                    logger.Debug($"Cancel watch highSale = b1FirstSale ,name = {name}, code = {StockCode}, b1FirstSale = {b1FirstSale ?? b1Sale}");
                                    Stop();
                                    continue;
                                }
                                else if (b1FirstSale == null)
                                {
                                    b1FirstSale = b1Sale;
                                    logger.Info("Start to watching name = " + name + ", " + StockCode);
                                    Console.WriteLine("Start to watching  " + name + ", " + (StockCode.StartsWith("0") ? "sz" : "sh") + StockCode.Substring(2));
                                }
                                b1HighSale = b1Sale;

                                //  刚跳涨停，记录时间点，2分钟内不检查大单
                                if (b1HighSale >= highSale)
                                {
                                    becomeHighSaleTime = DateTime.Now;
                                    logger.Info($"name = {name}, code = {StockCode}, b1FirstSale = {b1FirstSale}, b1HighSale = {b1HighSale}, becomeHighSaleTime = " + becomeHighSaleTime);
                                }
                            }
                            if (int.TryParse(rootDto.data.f20, out int b) && b > 0) b1Count = b;
                            if (!int.TryParse(rootDto.data.f211, out int b1CountChange)) continue;
                            if (b <= 0) b1Count += b1CountChange;   //  b1Count已经有值了，不再进行变化加减
                            if (b1Sale <= 0 && b < 0 && b1CountChange <= 0) continue;

                            var debug = $"name = {name}, total = {totalValue}, rise highest sale = {highSale}, buy 1 sale = {b1HighSale}, count = {b1Count}, change count = {b1CountChange}";
                            logger.Debug(debug);
                            //Console.WriteLine(debug);

                            //  当股价刚刚到涨停价时判断是否买入
                            //  不再使用判断：总市值超过50亿，并且挂单总额超过5000万可以买入
                            //  按照总市值的 1% 来计算挂单买入条件
                            //  再按照买入条件的 5% 来计算大单条件撤单
                            double waitTotalValue = b1Count * 100 * b1HighSale;
                            if (saleStatus == SaleStatus.Buy && b1CountChange < 0)
                            {
                                //  再按照买入条件的 5% 来计算大单条件撤单, 大单撤单b1CountChange是负数
                                //  重新按照大单卖出占比挂单总额的 20% 判断撤单
                                if ((DateTime.Now - becomeHighSaleTime).TotalSeconds >= 2 * 60)
                                {
                                    b1CountChangeRecords[recordeIndex] = b1CountChange;
                                    recordeIndex++;
                                    if (recordeIndex >= 10) recordeIndex = 0;

                                    //  判断当出现大单时检查就近10单累计额占比是否超过总挂单额的50%
                                    var sumB1CountChange = b1CountChangeRecords.Sum();
                                    double bigChangeValue = Math.Abs(sumB1CountChange) * 100 * b1HighSale;
                                    var percent = bigChangeValue / (bigChangeValue + waitTotalValue);
                                    if (percent > 0.5)    //  超过50%
                                    {
                                        saleStatus = SaleStatus.Sale;
                                        //  todo 卖出交易
                                        var info = $" - - - Warning Cancel Trade stock name = {name}, code = {StockCode}, waitTotalValue = {waitTotalValue}, bigChangeValue = {bigChangeValue}, percent = {percent}, totalValue = {totalValue}, countChange = {b1CountChange}";
                                        logger.Info(info);
                                        Console.WriteLine(info);
                                        continue;
                                    }
                                }

                                //  变化后剩余挂单低于挂单总额的 70% 卖出
                                //var percentWait = waitTotalValue / (bigChangeValue + waitTotalValue);
                                //  低于指定挂单总额的撤单
                                if (waitTotalValue < tradeInValueCheck)
                                {
                                    saleStatus = SaleStatus.Sale;
                                    //  todo 交卖出
                                    var info = $" - - - Warning Cancel Trade stock name = {name}, code = {StockCode}, waitTotalValue = {waitTotalValue}, tradeInValueCheck = {tradeInValueCheck}, totalValue = {totalValue}";
                                    logger.Info(info);
                                    Console.WriteLine(info);
                                }
                            }

                            //  达到涨停价的才考虑买入
                            if (b1HighSale >= highSale)
                            {
                                //  买入
                                if (waitTotalValue > tradeInValueCheck)
                                {
                                    if (saleStatus == SaleStatus.None || saleStatus == SaleStatus.Sale)
                                    {
                                        saleStatus = SaleStatus.Buy;
                                        //  todo 交易买入
                                        var info = $" + + + Trade stock name = {name}, code = {StockCode}, waitTotalValue = {waitTotalValue}, tradeInValueCheck = {tradeInValueCheck}, totalValue = {totalValue}";
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
                logger.Debug($"End name = {name}, code = {StockCode}");
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
