import { useState, useEffect } from 'react'
import Preloader from "../src/components/Preload"
function App() {

  const { REACT_APP_API_KEY } = process.env
  const api = `${REACT_APP_API_KEY}`

  const [img, setimg] = useState("def")
  const [color, setcolor] = useState("black")
  const [city, setCity] = useState('')

  const [load, setLoad] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function error(err) {
    alert("Access to location required")
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  function success(pos) {
    var crd = pos.coords;
    const long = crd.longitude;
    const lat = crd.latitude;

    showWeather(long, lat);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);

  const handleChange = (event) => {
    setCity(event.target.value);
    // console.log('value is:', event.target.value);
  };

  async function getWeatherbyCityName(e) {
    // e.preventDefault();
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${api}`);
    const data = await res.json();
    // console.log(data)
    if (data.length === 0) {
      alert("City not found!");
    }
    else {
      showWeather(data[0].lon, data[0].lat)
    }
  }

  async function getWeather(long, lat) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric&lang=en`);
    const data = await res.json();
    return data;
  }

  async function getair(long, lat) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${long}&appid=${api}`);
    const data = await res.json();
    return data;
  }

  async function showWeather(long, lat) {
    const data = await getWeather(long, lat);
    const air_pol = await getair(long, lat);
    if (data) {
      // console.log(data);
      // const requested_time = data.dt;
      const { temp, feels_like, humidity } = data.main;
      const place = data.name;
      const { description, icon } = data.weather[0];
      const { sunrise, sunset } = data.sys;
      let uvi = data.uvi;
      const cloudiness = data.clouds.all;
      const visibility = data.visibility;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      const { speed } = data.wind;


      const fahrenheit_main = (temp * 9) / 5 + 32;
      const fahrenheit_feel = (feels_like * 9) / 5 + 32;
      let visibility_meter = visibility / 1000;

      if (uvi === undefined) {
        uvi = "N/A";
      }
      if (visibility_meter === 10) {
        visibility_meter = "Clear";
      }
      else {
        visibility_meter = `${visibility_meter} m`;
      }
      // Converting Epoch(Unix) time to GMT
      const sunriseGMT = new Date(sunrise * 1000);
      const sunsetGMT = new Date(sunset * 1000);
      // const requested_timeGMT = new Date(requested_time * 1000);

      let today = new Date();
      let hour = today.getHours();

      // Getting elements
      const iconImg = document.getElementById('weather-icon');
      const loc = document.querySelector('#location');
      const tempC = document.querySelector('.c');
      const tempF = document.querySelector('.f');
      const desc = document.querySelector('.desc');
      const sunriseDOM = document.querySelector('.sunrise');
      const sunsetDOM = document.querySelector('.sunset');
      const feelC = document.querySelector('.cf');
      const feelF = document.querySelector('.ff');
      const uv = document.querySelector('.uv');
      const vis = document.querySelector('.vis');
      const cloud = document.querySelector('.cloud');
      const humid = document.querySelector('.humidity')
      const timenow = document.querySelector('.time');
      const wind = document.querySelector('.wind')
      const circle = document.querySelector('.circle')
      const circle_info = document.querySelectorAll('.circle-info')

      // updateing values
      iconImg.src = iconUrl;
      loc.innerHTML = `${place}`;
      desc.innerHTML = `${description}`;
      tempC.innerHTML = `${temp.toFixed(2)} °C`;
      tempF.innerHTML = `${fahrenheit_main.toFixed(2)} °F`;
      feelC.innerHTML = `${feels_like.toFixed(2)} °C`;
      feelF.innerHTML = `${fahrenheit_feel.toFixed(2)} °F`;
      uv.innerHTML = `${uvi} `;
      vis.innerHTML = `${visibility_meter}`
      cloud.innerHTML = `${cloudiness} %`
      sunriseDOM.innerHTML = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
      sunsetDOM.innerHTML = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
      timenow.innerHTML = `${today}`;
      humid.innerHTML = `${humidity} %`
      wind.innerHTML = `${speed} m/s`

      // Change background image and color accoring to the time
      if (hour < 5 || hour >= 20) {
        setimg('night2');
        setcolor('white');
        circle.style.backgroundColor = "white";
        circle_info.forEach(element => {
          element.style.backgroundColor = 'white';
        });
      }
      else if (hour >= 5 && hour < 9) {
        setimg('morning');
      }
      else if (hour >= 9 && hour < 17) {
        setimg('afternoon');
      }
      else if (hour >= 17 && hour < 20) {
        setimg('evening');
        setcolor('white');
        circle.style.backgroundColor = "white";
        circle_info.forEach(element => {
          element.style.backgroundColor = 'white';
        });
      }
    }
    // Air Pollution
    if (air_pol) {
      // console.log(air_pol)
      const { aqi } = air_pol.list[0].main;
      const air = document.querySelector('.air')

      let quality = "";
      switch (aqi) {
        case 1:
          quality = "Good";
          break;
        case 2:
          quality = "Fair";
          break;
        case 3:
          quality = "Moderate";
          break;
        case 4:
          quality = "Poor";
          break;
        case 5:
          quality = "Very Poor";
          break;
        default:
          console.log("error");
      }

      air.innerHTML = `${quality}`
    }
  }

  return (
    <div>

      <Preloader load={load} />
      <div className="container" style={{
        backgroundImage: `url(images/${img}.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        color: `${color}`
      }}>
        <div>
          <div className="search-container">
            <input onChange={handleChange} value={city} placeholder='Type City name to get weather condition' />
            <button id='search-btn' onClick={getWeatherbyCityName}>Search</button>
          </div>
        </div>

        <img src="" alt="" srcSet="" id="weather-icon" />
        <div id="location">Unable to Fetch Weather</div>
        <div className="desc">No Information Available.</div>
        <div className="time">Error</div>
        <div className="weather">
          <div className="c">Error</div>
          <div className="circle"></div>
          <div className="f">Error</div>
        </div>
        <div>Feels Like </div>
        <div className="weather-feels">

          <div className="cf">Error</div>
          <div className="circle-info"></div>
          <div className="ff">Error</div>
        </div>
        <div className="add-info">
          Air Quality:
          <span className="air">Error</span>
          <div className="circle-info"></div>
          Humidity :
          <span className="humidity">Error</span>
          <div className="circle-info"></div>
          Wind Speed :
          <span className="wind">Error</span>
        </div>
        <div className="add-info">
          UV Index :
          <span className="uv">Error</span>
          <div className="circle-info"></div>
          Visibility :
          <span className="vis">Error</span>
          <div className="circle-info"></div>
          Cloudiness :
          <span className="cloud">Error</span>

        </div>

        <div className="info"></div>
        <h4>Sunrise: <span className="sunrise">No Information Available</span></h4>
        <h4>Sunset: <span className="sunset">No Information Available</span></h4>
      </div >
    </div>
  );
}

export default App;
