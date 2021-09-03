using Microsoft.Playwright;

namespace EastStockScanner.Dto
{
    public class LoginResult
    {
        public string Cookie;
        public string LocalUrl;
        public IPage Page;
    }
}
