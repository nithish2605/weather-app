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


async function getWeatherData(cityName) {
    try {
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
            weather_box.style.display = 'block';
            const { latitude, longitude, country, name } = geoData.results[0];
            city_name.innerHTML = name + "," + country;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=apparent_temperature,temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`;

            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            getCurrentData(data);
            getHourlyData(data);
            getDailyData(data);
        }
    }
    catch (error) {
        console.log("something went wrong", error);
    }
}

function getCurrentData(data) {
    console.log("Current city weather report....");
    console.log("Temperature", data.current.temperature_2m, data.current_units.temperature_2m);
    cur_temp.innerHTML = Math.round(data.current.temperature_2m);
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
        dailycount++;
        console.log(fromatedDay, "max-temp", data.daily.temperature_2m_max[i], "min-temp",
            data.daily.temperature_2m_min[i]);
    }
}