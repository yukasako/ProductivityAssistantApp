let getData = async (url) => {
  try {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  } catch (error) {
    console.log("Error fetching data");
  }
};

let weatherData = async () => {
  // Get weather data
  let params = new URLSearchParams();
  params.append("latitude", 59.3294);
  params.append("longitude", 18.0687);
  params.append("current", ["weather_code", "temperature_2m"]);

  let weatherData = await getData(
    `https://api.open-meteo.com/v1/forecast?` + params
  );
  console.log(weatherData);

  //DOM
  let temperature = weatherData.current.temperature_2m;
  let weatherCode = weatherData.current.weather_code;
  let weather = "";
  switch (weatherCode) {
    case 0:
      weather = "Clear";
      break;
    case 1:
      weather = "Partly cloudy";
      break;
    case 2:
      weather = "Snow";
      break;
    case 3:
      weather = "Blowing snow";
      break;
    case 4:
      weather = "Fog";
      break;
    case 5:
      weather = "Drizzle";
      break;
    case 6:
      weather = "Rain";
      break;
    case 7:
      weather = "Snow";
      break;
    case 8:
      weather = "Shower";
      break;
    case 9:
      weather = "Thunderstorm";
      break;
  }

  let weatherDiv = document.createElement("div");
  weatherDiv.innerText = `${temperature}℃ ${weather}`;
  navBtnGroup.prepend(weatherDiv);
};
weatherData();

// WMO weather code
// 0	Clear(No cloud at any level)
// 1	Partly cloudy(Scattered or broken)
// 2	Continuous layer(s) of blowing snow
// 3	Sandstorm, duststorm, or blowing snow
// 4	Fog, thick dust or haze
// 5	Drizzle
// 6	Rain
// 7	Snow, or rain and snow mixed
// 8	Shower(s)
// 9	Thunderstorm(s)
