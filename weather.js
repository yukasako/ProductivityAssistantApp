let getData = async (url) => {
  try {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  } catch (error) {
    console.log("Error fetching data");
  }
};

let getWeatherData = async () => {
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
  let weatherIcon = document.createElement("i");
  switch (weatherCode) {
    // 0	Clear sky
    // 1, 2, 3	Mainly clear, partly cloudy, and overcast
    case 0:
    case 1:
      weatherIcon.classList.add("fa-regular", "fa-sun");
      break;
    case 2:
    case 3:
      weatherIcon.classList.add("fa-solid", "fa-cloud-sun");
      break;
    // 45, 48	Fog and depositing rime fog
    case 45:
    case 48:
      weatherIcon.classList.add("fa-solid", "fa-smog");
      break;
    // 51, 53, 55	Drizzle: Light, moderate, and dense intensity
    // 56, 57	Freezing Drizzle: Light and dense intensity
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      weatherIcon.classList.add("fa-solid", "fa-cloud-rain");
      break;
    // 61, 63, 65	Rain: Slight, moderate and heavy intensity
    // 66, 67	Freezing Rain: Light and heavy intensity
    // 80, 81, 82	Rain showers: Slight, moderate, and violent
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      weatherIcon.classList.add("fa-solid", "fa-umbrella");
      break;
    // 71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
    // 77	Snow grains
    // 85, 86	Snow showers slight and heavy
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      weatherIcon.classList.add("fa-solid", "fa-snowflake");
      break;
    // 95 *	Thunderstorm: Slight or moderate
    // 96, 99 *	Thunderstorm with slight and heavy hail
    case 95:
    case 96:
    case 99:
      weatherIcon.classList.add("fa-solid", "fa-cloud-bolt");
      break;
  }

  let weatherDiv = document.createElement("div");
  weatherDiv.id = "weatherDiv";
  weatherDiv.innerHTML = `Stockholm ${temperature}℃`;
  weatherDiv.append(weatherIcon);
  navBtnGroup.prepend(weatherDiv);
};
getWeatherData();
