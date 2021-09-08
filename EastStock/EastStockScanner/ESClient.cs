using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;


public class SSEvent
{
    public string Name { get; set; }
    public string Data { get; set; }
}


public class Application
{
    public static List<string> Queue = new List<string>(1024);

    public static Stream OpenSSEStream(string url)
    {
        /*
            Optionally ignore certificate errors
            ServicePointManager.ServerCertificateValidationCallback =
             new System.Net.Security.RemoteCertificateValidationCallback(AcceptAllCertifications);
        */


        var request = WebRequest.Create(new Uri(url));
        ((HttpWebRequest)request).AllowReadStreamBuffering = false;
        var response = request.GetResponse();
        var stream = response.GetResponseStream();

        Application.ReadStreamForever(stream);

        return stream;
    }

    public static void ReadStreamForever(Stream stream)
    {
        var encoder = new UTF8Encoding();
        var buffer = new byte[2048];
        while (true)
        {
            //TODO: Better evented handling of the response stream

            if (stream.CanRead)
            {
                int len = stream.Read(buffer, 0, 2048);
                if (len > 0)
                {
                    var text = encoder.GetString(buffer, 0, len);
                    Application.Push(text);
                }
            }
            //System.Threading.Thread.Sleep(250);
        }
    }

    public static void Push(string text)
    {
        if (String.IsNullOrWhiteSpace(text))
        {
            return;
        }

        var lines = text.Trim().Split('\n');
        Application.Queue.AddRange(lines);

        if (text.Contains("data:"))
        {
            Application.ProcessLines();
        }
    }

    public static void ProcessLines()
    {
        var lines = Application.Queue;

        SSEvent lastEvent = null;
        int index = 0;
        int lastEventIdx = -1;

        for (int i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            if (String.IsNullOrWhiteSpace(line))
            {
                continue;
            }
            line = line.Trim();

            if (line.StartsWith("event:"))
            {
                lastEvent = new SSEvent()
                {
                    Name = line.Replace("event:", String.Empty)
                };
            }
            else if (line.StartsWith("data:"))
            {
                if (lastEvent == null)
                {
                    continue;
                }


                lastEvent.Data = line.Replace("data:", String.Empty);

                Console.WriteLine("Found event: " + index);
                Console.WriteLine("Name was: " + lastEvent.Name);
                Console.WriteLine("Data was: " + lastEvent.Data);
                index++;
                lastEventIdx = i;
            }
        }
        //trim previously processed events
        if (lastEventIdx >= 0)
        {
            lines.RemoveRange(0, lastEventIdx);
        }


    }

    /*
        Optionally ignore certificate errors

    */
    public bool AcceptALlCertifications(object sender,
        System.Security.Cryptography.X509Certificates.X509Certificate cert,
        System.Security.Cryptography.X509Certificates.X509Chain chain,
        System.Net.Security.SslPolicyErrors errors)
    {
        return true;
    }
}