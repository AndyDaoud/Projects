using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Net;
using System.Web.UI.HtmlControls;
using Newtonsoft.Json;
/*
 * Frontend code that handles button presses.
 * Uses the developed web service to obtain city forecast and air
 * quality data.  Then outputs the air quality and weeklong forecast 
 * of the given url.
 */
public partial class _Default : System.Web.UI.Page
{
    
    string localHost = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
    protected void Page_Load(object sender, EventArgs e)
    {
       
    }

    /*
     * Button click function that takes input from textbox.
     */
    protected void Button1_Click(object sender, EventArgs e)
    {
        /*
         * Applies given zipcode to web service.  Reads the
         * response stream and converts strings of data into
         * objects.
         */
        string url = @localHost + "/Service.svc/forecast?zip=" + TextBox1.Text;
        HttpWebRequest requ = (HttpWebRequest)WebRequest.Create(url);
        requ.ContentType = "application/json";
        WebResponse respo = requ.GetResponse();
        Stream dstream = respo.GetResponseStream();
        StreamReader sread = new StreamReader(dstream);
        string resporead = sread.ReadToEnd();

        List<Periods> weather = JsonConvert.DeserializeObject<List<Periods>>(resporead);

        string lon = @localHost + "/Service.svc/lon?zip=" + TextBox1.Text;
        HttpWebRequest req = (HttpWebRequest)WebRequest.Create(lon);
        WebResponse response = req.GetResponse();
        Stream dataStream = response.GetResponseStream();
        StreamReader sreader = new StreamReader(dataStream);
        string readResponse = sreader.ReadToEnd();
        
        string lat = @localHost + "/Service.svc/lat?zip=" + TextBox1.Text;
        HttpWebRequest req2 = (HttpWebRequest)WebRequest.Create(lat);
        WebResponse response2 = req2.GetResponse();
        Stream dataStream2 = response2.GetResponseStream();
        StreamReader sreader2 = new StreamReader(dataStream2);
        string readResponse2 = sreader2.ReadToEnd();

        string city = @localHost + "/Service.svc/city?zip=" + TextBox1.Text;
        HttpWebRequest req3 = (HttpWebRequest)WebRequest.Create(city);
        WebResponse response3 = req3.GetResponse();
        Stream dataStream3 = response3.GetResponseStream();
        StreamReader sreader3 = new StreamReader(dataStream3);
        string readResponse3 = sreader3.ReadToEnd();

        string air = @localHost + "/Service.svc/airquality?zip=" + TextBox1.Text;
        HttpWebRequest req4 = ((HttpWebRequest)WebRequest.Create(air));
        WebResponse response4 = req4.GetResponse();
        Stream dataStream4 = response4.GetResponseStream();
        StreamReader sreader4 = new StreamReader(dataStream4);
        string readResponse4 = sreader4.ReadToEnd();

        Root airQuality = JsonConvert.DeserializeObject<Root>(readResponse4);

        /*
         * Display's data onto service page
         */

        string output = "<br>City: " + readResponse3 + "<br>Coordinates: " + readResponse2 + "," + readResponse;
        output += "<br><br>Air Quality Index: " + airQuality.list[0].main.aqi;
        output += "<br>Five Major Pollutants - Ozone: " + airQuality.list[0].components.o3 + " Nitrogen Oxide: " + airQuality.list[0].components.no + " Carbon Monoxide: " + airQuality.list[0].components.co + " Sulfur Dioxide: " + airQuality.list[0].components.so2 + " Particulate Matter: PM10: " + airQuality.list[0].components.pm10 + " PM2.5: " + airQuality.list[0].components.pm2_5;
        output += "<br><br>Forecast: ";
        for (int i = 0; i < weather.Count; i++)
        {
            output += "<br>Day: " + weather[i].name + "<br>Temperature: " + weather[i].temperature + "<br>Forecast: " + weather[i].detailedForecast + "<br>";
        }
        Label1.Text = output;
    }
}