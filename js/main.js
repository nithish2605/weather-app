let input_city = "";
let btn_srch = document.querySelector('.btn-srch');
let city_name = document.querySelector('.city-coun');
let cur_temp = document.querySelector('.cur-temp');
let cur_date = document.querySelector('.cur_date');
let cur_feelsLike = document.querySelector('.feels-like-temp');
let cur_humidity = document.querySelector('.humidity');
let cur_wind = document.querySelector('.wind');
let cur_precipitation = document.querySelector('.precipitation');
let hour_val = document.querySelectorAll('.hour-time');
let hour_temp = document.querySelectorAll('.hour-temp');
let daily_dayName = document.querySelectorAll('.daily-day');
let max_temp = document.querySelectorAll('.max-temp');
let min_temp = document.querySelectorAll('.min-temp');
let no_result_section = document.querySelector('.no-result-section');
let weather_box = document.querySelector('.weather-report-box');
let cur_weather_img = document.querySelector('.cur-weather-img');
let daily_weather_img = document.querySelectorAll('.daily-weather-icon');
let hourly_weather_img = document.querySelectorAll('.hour-icon');
let units_temp = document.querySelectorAll('.unit-temp');
let units_wind = document.querySelectorAll('.unit-wind');
let selectedTempUnit = "celsius";
let selectedWindUnit = "kmh";
let loader = document.querySelector('.Loading-section');

document.querySelector('.city-input').addEventListener('input', function () {
    input_city = this.value;
})

//search when  clicked on Enter key
document.querySelector('.city-input').addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        getWeatherData(input_city);
    }
})

//search when  clicked on srch btn
btn_srch.addEventListener('click', () => { 
    getWeatherData(input_city);
});

units_temp.forEach(unit => {
    unit.addEventListener('click',()=>{
    selectedTempUnit = unit.dataset.temp;
      getWeatherData(input_city);
    })
});

units_wind.forEach(unit => {
    unit.addEventListener('click',()=>{
    selectedWindUnit = unit.dataset.wind.toLowerCase().trim();
    getWeatherData(input_city);
    })
});

//clearing the input field when empty
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.city-input').value = "";
    input_city = "";
});


const weatherCodeMeaning = {
    0:  "icon-sunny",
    1:  "icon-sunny",
    2:  "icon-partly-cloudy",
    3:  "icon-overcast",

    45: "icon-fog",
    48: "icon-fog",

    51: "icon-drizzle",
    53: "icon-drizzle",
    55: "icon-drizzle",

    56: "icon-drizzle",
    57: "icon-drizzle",

    61: "icon-rain",
    63: "icon-rain",
    65: "icon-rain",

    66: "icon-rain",
    67: "icon-rain",

    71: "icon-snow",
    73: "icon-snow",
    75: "icon-snow",
    77: "icon-snow",

    80: "icon-rain",
    81: "icon-rain",
    82: "icon-rain",

    85: "icon-snow",
    86: "icon-snow",

    95: "icon-storm",
    96: "icon-storm",
    99: "icon-storm"
};


async function getWeatherData(cityName) {
    try {
        loader.style.display = 'block';
        weather_box.style.display = 'none';
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        console.log(geoData);
        if (!geoData.results || geoData.results.length === 0) {
            console.log("City name not found..");
            weather_box.style.display = 'none';
            no_result_section.classList.add('active');
            return;
        }
        else {
            no_result_section.classList.remove('active');
            const { latitude, longitude, country, name } = geoData.results[0];
            city_name.innerHTML = name + "," + country;
    
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=apparent_temperature,temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&temperature_unit=${selectedTempUnit}&wind_speed_unit=${selectedWindUnit}&timezone=auto`;

            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            getCurrentData(data);
            getHourlyData(data);
            getDailyData(data);
            loader.style.display = 'none';
            weather_box.style.display = 'block';

        }
    }
    catch (error) {
        console.log("something went wrong", error);
    }
    finally{
            loader.style.display = 'none';
    }
}

function getCurrentData(data) {
    console.log("Current city weather report....");

    console.log("Temperature", data.current.temperature_2m, data.current_units.temperature_2m);
    cur_temp.innerHTML = Math.round(data.current.temperature_2m) + data.current_units.temperature_2m;
    let curr_date = data.current.time;
    const date = new Date(curr_date);
    const options = {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric"
    };
    const curr_format_date = date.toLocaleDateString("en-US", options);
    cur_date.innerHTML = curr_format_date;//displaying curr date and day
    cur_feelsLike.innerHTML = data.current.apparent_temperature + " " + data.current_units.apparent_temperature//feelslike
    cur_humidity.innerHTML = data.current.relative_humidity_2m + " " + data.current_units.relative_humidity_2m;//humidity
    cur_wind.innerHTML = data.current.wind_speed_10m + " " + data.current_units.wind_speed_10m;//curwind
    cur_precipitation.innerHTML = data.current.precipitation + " " + data.current_units.precipitation;//precipitation
    let weatherCode = data.current.weather_code;
    cur_weather_img.src = './assets/images/'+ weatherCodeMeaning[weatherCode] + '.webp';
}

function getHourlyData(data) {
    //Hourly report
    console.log("Hourly report .....");
    const currenttime = data.current.time;
    const currentHour = currenttime.slice(0, 13) + ":00"; //2025-11-12T11:00 
    const hourStamp = data.hourly.time.findIndex(t => t == currentHour);
    let count = 0;
    for (let i = hourStamp; i < hourStamp + 8; i++) {
        const time = data.hourly.time[i];
        const temp = Math.round(data.hourly.temperature_2m[i]);
        const formattedTime = new Date(time).toLocaleTimeString('en-IN', {
            hour: 'numeric',
            hour12: true
        });
        hour_val[count].innerHTML = formattedTime;
        hour_temp[count].innerHTML = temp;  
        let weatherCode = data.hourly.weather_code[i];
        hourly_weather_img[count].src = './assets/images/'+ weatherCodeMeaning[weatherCode] + '.webp'; 
        count++;
    }
}

function getDailyData(data) {
    //Daily report
    console.log("Daily report ....");
    let dailycount = 0;
    for (let i = 0; i < data.daily.time.length; i++) {
        const time = data.daily.time[i];
        const fromatedDay = new Date(time).toLocaleString('en-IN', {
            weekday: 'short'
        });
        daily_dayName[dailycount].innerHTML = fromatedDay;
        max_temp[dailycount].innerHTML = Math.round(data.daily.temperature_2m_max[i]);
        min_temp[dailycount].innerHTML = Math.round(data.daily.temperature_2m_min[i]);
        let weatherCode = data.daily.weather_code[dailycount];
        daily_weather_img[dailycount].src = './assets/images/'+ weatherCodeMeaning[weatherCode] + '.webp'; 
        dailycount++;
        console.log(fromatedDay, "max-temp", data.daily.temperature_2m_max[i], "min-temp",
        data.daily.temperature_2m_min[i]);
    }
}