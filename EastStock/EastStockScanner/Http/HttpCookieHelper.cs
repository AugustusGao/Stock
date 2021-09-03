using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ML.NetComponent.Http
{
    /// <summary>
    /// Cookie操作帮助类
    /// </summary>
    public static class HttpCookieHelper
    {
        /// <summary>
        /// 根据字符生成Cookie列表
        /// </summary>
        /// <param name="cookie">Cookie字符串</param>
        /// <returns></returns>
        public static List<CookieItem> GetCookieList(string cookie)
        {
            List<CookieItem> cookielist = new List<CookieItem>();
            if (string.IsNullOrEmpty(cookie)) return cookielist;

            foreach (string item in cookie.Split(new string[] { ";", "," }, StringSplitOptions.RemoveEmptyEntries))
            {
                if (Regex.IsMatch(item, @"([\s\S]*?)=([\s\S]*?)$"))
                {
                    Match m = Regex.Match(item, @"([\s\S]*?)=([\s\S]*?)$");
                    var key = m.Groups[1].Value.Trim();
                    if (string.IsNullOrEmpty(key)) continue;
                    if (key != "expires" && key != "Domain" && key != "domain" && key != "Max-Age" && key != "path" && key != "Path" && !key.Contains("___ut"))
                        cookielist.Add(new CookieItem() { Key = m.Groups[1].Value, Value = m.Groups[2].Value });
                }
            }
            return cookielist;
        }

        /// <summary>
        /// 根据Key值得到Cookie值,Key不区分大小写
        /// </summary>
        /// <param name="Key">key</param>
        /// <param name="cookie">字符串Cookie</param>
        /// <returns></returns>
        public static string GetCookieValue(string Key, string cookie)
        {
            foreach (CookieItem item in GetCookieList(cookie))
            {
                if (item.Key == Key)
                    return item.Value;
            }
            return "";
        }
        /// <summary>
        /// 根据Key删除对应的cookie
        /// </summary>
        /// <param name="key"></param>
        /// <param name="cookie"></param>
        /// <returns></returns>
        public static string RemoveCookieByKey(string key, string cookie)
        {
            var list = GetCookieList(cookie);
            list.RemoveAll(o => o.Key == key);
            return CookieListFormat(list);
        }
        /// <summary>
        /// 根据模糊查询关键字fuzzyKey查找key相似，并删除对应的cookie
        /// </summary>
        /// <param name="fuzzyKey">模糊查询关键字</param>
        /// <param name="cookie"></param>
        /// <returns></returns>
        public static string RemoveCookieByFuzzyKey(string fuzzyKey, string cookie)
        {
            var list = GetCookieList(cookie);
            list.RemoveAll(o => o.Key.Contains(fuzzyKey));
            return CookieListFormat(list);
        }
        /// <summary>
        /// 格式化Cookie为标准格式
        /// </summary>
        /// <param name="key">Key值</param>
        /// <param name="value">Value值</param>
        /// <returns></returns>
        public static string CookieFormat(string key, string value)
        {
            //  以逗号分割,SetCookie时候是用逗号分割才能加进去。request.CookieContainer.SetCookies(uri, item.Cookie);
            return string.Format("{0}={1},", key, value);
        }

        public static string CookieListFormat(List<CookieItem> cookieList)
        {
            string cookie = string.Empty;
            foreach (CookieItem item in cookieList)
            {
                cookie += CookieFormat(item.Key, item.Value);
            }
            return cookie;
        }
        /// <summary>
        /// 合并两个cookie,key相同更新，不同就添加
        /// </summary>
        /// <param name="firstCookie"></param>
        /// <param name="secondCookie"></param>
        /// <returns></returns>
        public static string CombineCookie(string firstCookie, string secondCookie)
        {
            var f = GetCookieList(firstCookie);
            var s = GetCookieList(secondCookie);
            var keys = f.Select(o => o.Key).ToList();
            var updateKeys = new List<string>();
            foreach (var c in s)
            {
                if (keys.Contains(c.Key))
                {
                    f.First(o => o.Key == c.Key).Value = c.Value;
                    updateKeys.Add(c.Key);
                }
            }
            s.RemoveAll(o => updateKeys.Contains(o.Key));
            return CookieListFormat(f.Concat(s).ToList());
        }
    }

    /// <summary>
    /// Cookie对象
    /// </summary>
    public class CookieItem
    {
        /// <summary>
        /// 键
        /// </summary>
        public string Key { get; set; }
        /// <summary>
        /// 值
        /// </summary>
        public string Value { get; set; }
    }
}
