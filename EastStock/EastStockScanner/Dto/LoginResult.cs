using Microsoft.Playwright;

namespace EastStockScanner.Dto
{
    public class LoginResult
    {
        public string Cookie;
        public string FirstUrl;
        public IPage Page;
    }
}
