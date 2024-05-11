﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using Newtonsoft.Json;
using System.IO;
using System.Net;


public class Service : IService
{
    public static string js = new WebClient().DownloadString("https://github.com/millbj92/US-Zip-Codes-JSON/blob/master/USCities.json?raw=true");
    public List<Periods> GetForecast(string zip)
    {
        string api = @"https://api.weather.gov/points/" + GetLat(zip) + "," + GetLon(zip);
        HttpWebRequest req = (HttpWebRequest)WebRequest.Create(api);
        req.UserAgent = @"Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
        req.Credentials = CredentialCache.DefaultCredentials;
        req.ContentType = "application/geo+json";
		
        WebResponse resp = req.GetResponse();
        Stream stre = resp.GetResponseStream();
        StreamReader strd = new StreamReader(stre);
        var resper = strd.ReadToEnd();
        resp.Close();
		
        var weatherfore = JsonConvert.DeserializeObject<WeatherData>(resper);
        api = @weatherfore.properties.forecast;
        req = (HttpWebRequest)WebRequest.Create(api);
        req.UserAgent = @"Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
        req.Credentials = CredentialCache.DefaultCredentials;
        req.ContentType = "application/geo+json";
        resp = req.GetResponse();
        stre = resp.GetResponseStream();
        strd = new StreamReader(stre);
        resper = strd.ReadToEnd();
        resp.Close();
        var weafore = JsonConvert.DeserializeObject<WeatherData>(resper);
		
        return weafore.properties.periods;

    }
    
    public Root GetAirQuality(string zip)
    {
        string key = "2d635575bff7dd3e424c48ec72010d61";
        string api2 = @"http://api.openweathermap.org/data/2.5/air_pollution?lat=" + GetLat(zip) + "&lon=" + GetLon(zip) + "&appid=" + key;
        HttpWebRequest req2 = (HttpWebRequest)WebRequest.Create(api2);
        req2.UserAgent = @"Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
        req2.Credentials = CredentialCache.DefaultCredentials;
        req2.ContentType = "application/geo+json";
        WebResponse resp2 = req2.GetResponse();
        Stream stre2 = resp2.GetResponseStream();
        StreamReader strd2 = new StreamReader(stre2);
        var resper2 = strd2.ReadToEnd();
        resp2.Close();
        Root airquality = JsonConvert.DeserializeObject<Root>(resper2);
        return airquality;

    }

    public float GetLon(string zip)
    {
        int zipc = int.Parse(zip);
        var zips = JsonConvert.DeserializeObject<List<ZipCoor>>(js);
        for (int i = 0; i < zips.Count; i++)
        {
            if (zipc == zips[i].zip_code)
            {
                return float.Parse(zips[i].longitude);
            }
        }
        return 0;

    }
    public float GetLat(string zip)
    {
        int zipc = int.Parse(zip);
        var zips = JsonConvert.DeserializeObject<List<ZipCoor>>(js);
        for (int i = 0; i < zips.Count; i++)
        {
            if (zipc == zips[i].zip_code)
            {
                return float.Parse(zips[i].latitude);
            }
        }
        return 0;

    }

    public string GetCity(string zip)
    {
        int zipc = int.Parse(zip);
        var zips = JsonConvert.DeserializeObject<List<ZipCoor>>(js);
        for (int i = 0; i < zips.Count; i++)
        {
            if (zipc == zips[i].zip_code)
            {
                return (zips[i].city);
            }
        }
        return "Nothing Found";

    }


    public class ZipCoor
    {
        public int zip_code { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string county { get; set; }
    }
}

