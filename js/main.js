let input_city = "";
let btn_srch = document.querySelector('.btn-srch');
let ciyt_name = document.querySelector('.city-coun');
let cur_temp = document.querySelector('.cur-temp');
let cur_date = document.querySelector('.cur_date');

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
        }
        else {
            const { latitude, longitude, country, name } = geoData.results[0];
            // console.log(latitude, longitude, country, name);
            ciyt_name.innerHTML = name +","+ country;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=apparent_temperature,temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`;

            const response = await fetch(url);
            const data = await response.json(); 
            console.log(data);
            console.log("Current city weather report....");
            console.log("Temperature", data.current.temperature_2m, data.current_units.temperature_2m);
            cur_temp.innerHTML = data.current.temperature_2m + data.current_units.temperature_2m;
            let curr_date = data.current.time;
            const date = new Date(curr_date);
            const options = {
                weekdays:"long",
                month:"sh0rt",
                day:"numeric",
                year:"numeric"
            };
            const curr_format_date = date.toLocaleDateString("en-US",options);
            cur_date.innerHTML = curr_format_date;
            console.log("Feels like", data.current.apparent_temperature, data.current_units.apparent_temperature);
            console.log("humidity", data.current.relative_humidity_2m, data.current_units.relative_humidity_2m);
            console.log("Wind", data.current.wind_speed_10m, data.current_units.wind_speed_10m);
            console.log("Perciption", data.current.precipitation, data.current_units.precipitation);
            console.log("Hourly report ....");

            const currenttime = data.current.time;
            const currentHour = currenttime.slice(0, 13) + ":00"; //2025-11-12T11:00 
            const hourStamp = data.hourly.time.findIndex(t => t == currentHour);
            for (let i = hourStamp; i < hourStamp + 8; i++) {
                const time = data.hourly.time[i];
                const temp = data.hourly.temperature_2m[i];
                const formattedTime = new Date(time).toLocaleTimeString('en-IN', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                console.log(`Time : ${formattedTime} , Temperature : ${temp}`);
            }

            console.log("Daily report ....");
            for (let i = 0; i < data.daily.time.length; i++) {
                const time = data.daily.time[i];
                const fromatedDay = new Date(time).toLocaleString('en-IN', {
                    weekday: 'long'
                });
                console.log(fromatedDay, "max-temp", data.daily.temperature_2m_max[i], "min-temp",
                    data.daily.temperature_2m_min[i]);
            }
        }
    }
    catch (error) {
        console.log("something went wrong", error);
    }
}
// getWeatherData("chennai");