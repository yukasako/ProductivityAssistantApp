let getData = async (url) => {
  try {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  } catch (error) {
    console.log("Error fetching data");
  }
};

let getWeatherData = async (latitude, longitude) => {
  // Get weather data
  let params = new URLSearchParams();
  params.append("latitude", latitude);
  params.append("longitude", longitude);
  params.append("current", ["weather_code", "temperature_2m"]);

  let weatherData = await getData(
    `https://api.open-meteo.com/v1/forecast?` + params
  );

  //Put the weatherData to DOM
  weatherDiv.innerHTML = "";
  weatherIcon.classList = "";
  let temperatureData = weatherData.current.temperature_2m;
  let weatherCode = weatherData.current.weather_code;
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
  temperature.innerText = `${temperatureData}°C`;
  weatherDiv.append(location, weatherIcon, temperature);
};

weatherDiv.id = "weatherDiv";
let temperature = document.createElement("span");
let weatherIcon = document.createElement("i");

// Choose location
let location = document.createElement("select");
location.id = "location";
location.innerHTML = `
<option value="stockholm" selected="selected">Stockholm</option>
<option value="tokyo">Tokyo</option>
<option value="newyork">New York</option>
<option value="london">London</option>
`;
location.addEventListener("change", () => {
  if (location.value == "tokyo") {
    getWeatherData(-23.5505, -46.6333);
  } else if (location.value == "newyork") {
    getWeatherData(40.7127, -74.0059);
  } else if (location.value == "london") {
    getWeatherData(51.5073, -0.1277);
  } else if (location.value == "stockholm") {
    getWeatherData(59.3293, 18.0685);
  }
});

// When logged in
if (localStorage.getItem("loggedInUser")) {
  getWeatherData(59.3293, 18.0685);
}
