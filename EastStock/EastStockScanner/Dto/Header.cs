using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EastStockScanner.Dto
{
    public class Header
    {
        public string title { get; set; }
        public string type { get; set; }
        public bool show { get; set; }
        public string name { get; set; }
        public string key { get; set; }
        public bool order { get; set; }
        public string href { get; set; }
        public string[] data { get; set; }
        public string fixedkey { get; set; }
        public string color { get; set; }
    }
}
