using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

[ServiceContract]
public interface IService
{

    [OperationContract]
    [WebGet(UriTemplate = "forecast?zip={zip}", ResponseFormat = WebMessageFormat.Json)]
    List<Periods> GetForecast(string zip);


    [OperationContract]
    [WebGet(UriTemplate = "lon?zip={zip}", ResponseFormat = WebMessageFormat.Json)]
    float GetLon(string zip);


    [OperationContract]
    [WebGet(UriTemplate = "lat?zip={zip}", ResponseFormat = WebMessageFormat.Json)]
    float GetLat(string zip);

    [OperationContract]
    [WebGet(UriTemplate = "city?zip={zip}", ResponseFormat = WebMessageFormat.Json)]
    string GetCity(string zip);

    [OperationContract]
    [WebGet(UriTemplate = "airquality?zip={zip}", ResponseFormat = WebMessageFormat.Json)]
    Root GetAirQuality(string zip);

}


public class WeatherData
{
    public Properties properties { get; set; }
}

public class Properties
{
    public string forecast { get; set; }
    public List<Periods> periods { get; set; }

}

public class Periods
{
    public int number { get; set; }
    public string name { get; set; }
    public Boolean isDaytime { get; set; }
    public int temperature { get; set; }
    public string detailedForecast { get; set; }
    
}

public class Coord
{
    public double lon { get; set; }
    public double lat { get; set; }
}

public class Main
{
    public int aqi { get; set; }
}

public class Components
{
    public double co { get; set; }
    public double no { get; set; }
    public double no2 { get; set; }
    public double o3 { get; set; }
    public double so2 { get; set; }
    public double pm2_5 { get; set; }
    public double pm10 { get; set; }
    public double nh3 { get; set; }
}

public class List
{
    public Main main { get; set; }
    public Components components { get; set; }
    public int dt { get; set; }
}

public class Root
{
    public Coord coord { get; set; }
    public List<List> list { get; set; }
}


