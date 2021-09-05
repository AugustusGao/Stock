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
        public int f1 { get; set; }
        public float f2 { get; set; }
        public float f3 { get; set; }
        public float f4 { get; set; }
        public int f5 { get; set; }
        public float f6 { get; set; }
        public float f7 { get; set; }
        public float f8 { get; set; }
        public float f9 { get; set; }
        public float f10 { get; set; }
        public float f11 { get; set; }
        public string f12 { get; set; }
        public int f13 { get; set; }
        public string f14 { get; set; }
        public float f15 { get; set; }
        public float f16 { get; set; }
        public float f17 { get; set; }
        public float f18 { get; set; }
        public long f20 { get; set; }
        public long f21 { get; set; }
        public float f22 { get; set; }
        public float f23 { get; set; }
        public float f24 { get; set; }
        public float f25 { get; set; }
        public float f62 { get; set; }
        public float f115 { get; set; }
        public string f128 { get; set; }
        public string f140 { get; set; }
        public string f141 { get; set; }
        public string f136 { get; set; }
        public int f152 { get; set; }
    }

}
