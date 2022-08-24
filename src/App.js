import { useState, useEffect } from 'react'
import Preloader from "../src/components/Preload"

function App() {
  const { REACT_APP_API_KEY } = process.env
  const api = `${REACT_APP_API_KEY}`

  const [img, setimg] = useState("def")
  const [color, setcolor] = useState("black")

  const [load, setLoad] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  window.addEventListener('load', () => {
    let long;
    let lat;

    // Accesing Geolocation of User
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Storing Longitude and Latitude in variables
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric&lang=en`;

        const air_pol = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${long}&appid=${api}`

        // Using fetch to get data
        // Air-pollution
        fetch(air_pol)
          .then((response) => {
            return response.json();
          })
          .then((list) => {

            const { aqi } = list.list[0].main;
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

            air.textContent = `${quality}`
          })

        // Weather
        fetch(base)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
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
            loc.textContent = `${place}`;
            desc.textContent = `${description}`;
            tempC.textContent = `${temp.toFixed(2)} °C`;
            tempF.textContent = `${fahrenheit_main.toFixed(2)} °F`;
            feelC.textContent = `${feels_like.toFixed(2)} °C`;
            feelF.textContent = `${fahrenheit_feel.toFixed(2)} °F`;
            uv.textContent = `${uvi} `;
            vis.textContent = `${visibility_meter}`
            cloud.textContent = `${cloudiness} %`
            sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
            sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
            timenow.textContent = `${today}`;
            humid.textContent = `${humidity} %`
            wind.textContent = `${speed} m/s`

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
          });
      });
    }
  });
  console.log(img)
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
