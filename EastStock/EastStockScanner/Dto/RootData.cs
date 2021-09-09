using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EastStockScanner.Dto
{

    public class RootData
    {
        public int rc { get; set; }
        public int rt { get; set; }
        public long svr { get; set; }
        public int lt { get; set; }
        public int full { get; set; }
        public Data data { get; set; }
    }

    public class Data
    {
        public int total { get; set; }
        public Diff[] diff { get; set; }
    }

    public class Diff
    {
        public string f1 { get; set; }
        public string f2 { get; set; }
        public string f3 { get; set; }
        public string f4 { get; set; }
        public string f5 { get; set; }
        public string f6 { get; set; }
        public string f7 { get; set; }
        public string f8 { get; set; }
        public string f9 { get; set; }
        public string f10 { get; set; }
        public string f11 { get; set; }
        public string f12 { get; set; }
        public string f13 { get; set; }
        public string f14 { get; set; }
        public string f15 { get; set; }
        public string f16 { get; set; }
        public string f17 { get; set; }
        public string f18 { get; set; }
        public long f20 { get; set; }
        public long f21 { get; set; }
        public string f22 { get; set; }
        public string f23 { get; set; }
        public string f24 { get; set; }
        public string f25 { get; set; }
        public string f62 { get; set; }
        public string f115 { get; set; }
        public string f128 { get; set; }
        public string f140 { get; set; }
        public string f141 { get; set; }
        public string f136 { get; set; }
        public string f152 { get; set; }
    }

}
