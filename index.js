const $ = document.querySelector.bind(document);
const content = $(".content");
const input_country = $(".input_country");
const submit_country = $(".submit_country");
const get_html = document.documentElement;
const get_body = document.body;

let weather;
let wind_now = true, real_feel_now = true;

//Show Input Country Weather
submit_country.onclick = async () => {
  try {
    const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=94a14d2c9bc6431b8a531251230802&q=${input_country.value}&days=1&aqi=yes&alerts=no`);
    if (res.status == 200) {
      content.innerHTML = '';
      get_html.classList.remove("h-100");
      get_body.classList.remove("h-100");
      get_body.classList.remove("position-relative");
      content.classList.remove("position-absolute");
      content.classList.remove("top-50");
      content.classList.remove("start-50");
      content.classList.remove("translate-middle");
      fetch_weather_data(input_country.value);
    } else {
      show_cannot_find();
    }
  } catch(err) {
  }
};

window.onload = () => {
  fetch('https://api.ipregistry.co/118.69.78.115?key=c2fa4zjja6d8n50i')
    .then(function (response) {
        return response.json();
    })
    .then(function (payload) {
      fetch_weather_data(payload.location.city);
    });
}

const fetch_weather_data = (location) => {
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=94a14d2c9bc6431b8a531251230802&q=${location}&days=1&aqi=yes&alerts=no`)
    .then((response) => response.json())
    .then((data) => show_data(data))
    .catch((err) => console.log(err));
}

const show_data = (data) => {
  weather = `
    <div class="d-flex pt-2 pb-2 ps-4 pe-4 row m-0">
      <div class="current_weather p-3 col-6 d-flex flex-column justify-content-between">
        <div class="current_weather_info row m-0">
          <div class="col-8 mt-auto mb-auto">
            <h1 class="mb-3 text-center">${data.location.name}</h1>
            <p class="text-center">${data.location.localtime} ${data.location.tz_id}</p>
            <div class="d-flex justify-content-center">
              <h1 class="m-0">${data.current.temp_c}</h1>
              <img class="mt-auto mb-auto" width="30px" height="30px" src="https://cdn-icons-png.flaticon.com/512/6518/6518520.png"/>
            </div>
          </div>
          <div class="col-4 m-auto d-flex justify-content-center row">
            <div class="d-block col-12">
              <img width="100%" height="100%" src ="${data.current.condition.icon}"/>
            </div>
            <div class="text-center"><h4>${data.current.condition.text}</h4></div>
          </div>
        </div>
        <div class="air_condition_ctn p-2">
          <span class="text-uppercase">Air Condition</span>
            <div class="row h-100">
              <div class="col-6 m-auto text-center">
                <span class="air_condi_title"><i class="fa-solid fa-water me-2 mb-2"></i> Humidity</span>
                <h2 class="m-0">${data.current.humidity}</h2>
              </div>
              <div class="wind_ctn col-6 m-auto text-center">
                <span class="air_condi_title"><i class="fa-solid fa-wind me-2 mb-2"></i> Wind 
                  <button class="border-0 ms-1"><i class="fa-solid fa-repeat"></i></button>
                </span>
                <h2 class="m-0">${data.current.wind_kph} km/h</h2>
              </div>
              <div class="real_feel_ctn col-6 m-auto text-center">
                <span class="air_condi_title"><i class="fa-solid fa-temperature-high me-2 mb-2"></i> Real Feel
                  <button class="border-0 ms-1"><i class="fa-solid fa-repeat"></i></button>
                </span>
                <div class="d-flex justify-content-center">
                  <h2 class="m-0">${data.current.feelslike_c}</h2>
                  <img class="mt-auto mb-auto" width="25px" height="25px" src="https://cdn-icons-png.flaticon.com/512/6518/6518520.png"/>
                </div>
              </div>
              <div class="col-6 m-auto text-center">
                <span class="air_condi_title"><i class="fa-solid fa-sun me-2 mb-2"></i>UV Index</span>
                <h2 class="m-0">${data.current.uv}</h2>
              </div>
            </div>
        </div>
      </div>
      <!-- Today Weather -->
      <div class="today_weather p-3 col-6">
        <span class="text-uppercase">today's forecast</span>
        <ul class="p-0 m-0"></ul>
      </div>
    </div>
    <!-- Today Temp -->
    <div class="pt-2 pb-2 ps-4 pe-4">
      <h4 class="text-center mt-2">Today Temperature</h4>
      <canvas id="myChart"></canvas>
    </div>
  `;
  content.innerHTML += weather;

  const today_weather = $(".today_weather ul");
  let today_report = data.forecast.forecastday[0].hour;

  //OnLoad Today Weather
  select_icon_change(1);
  for (let i = 6; i < 12; i++){
        day_weather = `
        <li class="row m-0 p-1 border-bottom border-secondary d-flex justify-content-between">
          <div class="col-1 p-0 m-auto">${today_report[i].time.substr(today_report[i].time.length - 5)}</div>
          <div class="col-4 p-0 fw-bold d-flex"><img width="90px" height="90px" src= "${today_report[i].condition.icon}"/> <span class="m-auto text-center">${today_report[i].condition.text}</span></div>
          <div class="col-3 p-0 d-flex"><i class="rain fa-solid fa-cloud-rain me-2 m-auto"></i><span class="m-auto">Chance of rain: <b>${today_report[i].will_it_rain}</b></span></div>
          <div class="col-3 p-0 d-flex"> <i class="fa-solid fa-snowflake me-2 m-auto"></i><span class="m-auto">Chance of snow: <b>${today_report[i].will_it_snow}</b></span></div>
        </li>
      `
      today_weather.innerHTML += day_weather;
  };

  let select_time = $(".select_time"); 
  select_time.onchange = () => time_change();

  // Show Today weather
  const time_change = () => {
    let select_time_var = select_time.value;
    if (select_time_var == 1)
    {
      select_icon_change(select_time_var);
      if (today_weather.hasChildNodes()) {
        today_weather.innerHTML = '';
      } 
      for (let i = 6; i < 12; i++){
        day_weather = `
        <li class="row p-1 border-bottom border-secondary d-flex justify-content-between">
          <div class="col-1 p-0 m-auto">${today_report[i].time.substr(today_report[i].time.length - 5)}</div>
          <div class="col-4 p-0 fw-bold d-flex"><img width="90px" height="90px" src= "${today_report[i].condition.icon}"/> <span class="m-auto text-center">${today_report[i].condition.text}</span></div>
          <div class="col-3 p-0 d-flex"><i class="rain fa-solid fa-cloud-rain me-2 m-auto"></i><span class="m-auto">Chance of rain: <b>${today_report[i].will_it_rain}</b></span></div>
          <div class="col-3 p-0 d-flex"> <i class="fa-solid fa-snowflake me-2 m-auto"></i><span class="m-auto">Chance of snow: <b>${today_report[i].will_it_snow}</b></span></div>
        </li>
      `
      today_weather.innerHTML += day_weather;
      };
    }else if (select_time_var == 2)
    {
      select_icon_change(select_time_var);
      if (today_weather.hasChildNodes()) {
        today_weather.innerHTML = '';
      } 
      for (let i = 12; i < 18; i++){
        day_weather = `
        <li class="row p-1 border-bottom border-secondary d-flex justify-content-between">
          <div class="col-1 p-0 m-auto">${today_report[i].time.substr(today_report[i].time.length - 5)}</div>
          <div class="col-4 p-0 fw-bold d-flex"><img width="90px" height="90px" src= "${today_report[i].condition.icon}"/> <span class="m-auto text-center">${today_report[i].condition.text}</span></div>
          <div class="col-3 p-0 d-flex"><i class="rain fa-solid fa-cloud-rain me-2 m-auto"></i><span class="m-auto">Chance of rain: <b>${today_report[i].will_it_rain}</b></span></div>
          <div class="col-3 p-0 d-flex"> <i class="fa-solid fa-snowflake me-2 m-auto"></i><span class="m-auto">Chance of snow: <b>${today_report[i].will_it_snow}</b></span></div>
        </li>
      `
      today_weather.innerHTML += day_weather;
      };
    }else if (select_time_var == 3)
    {
      select_icon_change(select_time_var);
      if (today_weather.hasChildNodes()) {
        today_weather.innerHTML = '';
      } 
      for (let i = 18; i < 24; i++){
        day_weather = `
        <li class="row p-1 border-bottom border-secondary d-flex justify-content-between">
          <div class="col-1 p-0 m-auto">${today_report[i].time.substr(today_report[i].time.length - 5)}</div>
          <div class="col-4 p-0 fw-bold d-flex"><img width="90px" height="90px" src= "${today_report[i].condition.icon}"/> <span class="m-auto text-center">${today_report[i].condition.text}</span></div>
          <div class="col-3 p-0 d-flex"><i class="rain fa-solid fa-cloud-rain me-2 m-auto"></i><span class="m-auto">Chance of rain: <b>${today_report[i].will_it_rain}</b></span></div>
          <div class="col-3 p-0 d-flex"> <i class="fa-solid fa-snowflake me-2 m-auto"></i><span class="m-auto">Chance of snow: <b>${today_report[i].will_it_snow}</b></span></div>
        </li>
      `
      today_weather.innerHTML += day_weather;
      };
    }else if (select_time_var == 4)
    {
      select_icon_change(select_time_var);
      if (today_weather.hasChildNodes()) {
        today_weather.innerHTML = '';
      } 
      for (let i = 0; i < 6; i++){
        day_weather = `
        <li class="row p-1 border-bottom border-secondary d-flex justify-content-between">
          <div class="col-1 p-0 m-auto">${today_report[i].time.substr(today_report[i].time.length - 5)}</div>
          <div class="col-4 p-0 fw-bold d-flex"><img width="90px" height="90px" src= "${today_report[i].condition.icon}"/> <span class="m-auto text-center">${today_report[i].condition.text}</span></div>
          <div class="col-3 p-0 d-flex"><i class="rain fa-solid fa-cloud-rain me-2 m-auto"></i><span class="m-auto">Chance of rain: <b>${today_report[i].will_it_rain}</b></span></div>
          <div class="col-3 p-0 d-flex"> <i class="fa-solid fa-snowflake me-2 m-auto"></i><span class="m-auto">Chance of snow: <b>${today_report[i].will_it_snow}</b></span></div>
        </li>
      `
      today_weather.innerHTML += day_weather;
      };
    }
  }
  
  const mychart = document.getElementById('myChart');
  let chart_data_tempurature = [], chart_data_real_feel = [], chart_lable = [];

  for (let i = 0; i < 24; i++){
    if (i < 10) {
      temp = `0${i}:00`;
      chart_lable.push(temp);
      temp = ``;
    } else {
      temp = `${i}:00`;
      chart_lable.push(temp);
      temp = ``;
    }
  }
  console.log(data);
  today_report.forEach(Element => {
    chart_data_tempurature.push(Element.temp_c);
    chart_data_real_feel.push(Element.feelslike_c);
  });
  
  new Chart(mychart, {
    type: 'line',
    data: {
      labels: chart_lable,
      datasets: [{
        label: 'Air Temperature',
        data: chart_data_tempurature,
        borderWidth: 3,
        backgroundColor: "#0000FF",
        borderColor: "#0000FF",
      },
      {
        label: 'Real Feel Temperature',
        data: chart_data_real_feel,
        borderWidth: 3,
        backgroundColor: "#FF8C00",
        borderColor: "#FF8C00",
      },
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });

  //oC <-> oF
  const wind_speed = $(".wind_ctn span button");
  const wind_text = $(".wind_ctn h2");
  const real_feel_temp = $(".real_feel_ctn span button");
  const real_feel_text = $(".real_feel_ctn div h2");
  const real_feel_image = $(".real_feel_ctn div img");
  wind_speed.onclick = () => {
    if (wind_now === true) {
      wind_text.innerHTML = `${data.current.wind_mph} m/h`;
      wind_now = false;
    }
    else {
      wind_text.innerHTML = `${data.current.wind_kph} km/h`;
      wind_now = true;
    }
  }

  real_feel_temp.onclick = () => {
    if (real_feel_now === true) {
      real_feel_text.innerHTML = `${data.current.feelslike_f}`;
      real_feel_image.src = "https://cdn-icons-png.flaticon.com/512/2894/2894015.png";
      real_feel_now = false;
    }
    else {
      real_feel_text.innerHTML = `${data.current.feelslike_c}`;
      real_feel_image.src = "https://cdn-icons-png.flaticon.com/512/6518/6518520.png";
      real_feel_now = true;
    }
  }
}

const select_icon_change = (select_time_var) => {
  let select_time_icon = $(".select_ctn i");
    if (select_time_var == 1) {
      select_time_icon.classList.remove("fa-solid");
      select_time_icon.classList.remove("fa-cloud-sun");
      select_time_icon.classList.remove("fa-moon");
      select_time_icon.classList.remove("fa-cloud-moon");
      select_time_icon.classList.add("fa-solid");
      select_time_icon.classList.add("fa-sun");
    } else if (select_time_var == 2) {
      select_time_icon.classList.remove("fa-solid");
      select_time_icon.classList.remove("fa-sun");
      select_time_icon.classList.remove("fa-moon");
      select_time_icon.classList.remove("fa-cloud-moon");
      select_time_icon.classList.add("fa-solid");
      select_time_icon.classList.add("fa-cloud-sun");
    } else if (select_time_var == 3) {
      select_time_icon.classList.remove("fa-solid");
      select_time_icon.classList.remove("fa-sun");
      select_time_icon.classList.remove("fa-cloud-sun");
      select_time_icon.classList.remove("fa-cloud-moon");
      select_time_icon.classList.add("fa-solid");
      select_time_icon.classList.add("fa-moon");
    } else if (select_time_var == 4) {
      select_time_icon.classList.remove("fa-solid");
      select_time_icon.classList.remove("fa-sun");
      select_time_icon.classList.remove("fa-cloud-sun");
      select_time_icon.classList.remove("fa-moon");
      select_time_icon.classList.add("fa-solid");
      select_time_icon.classList.add("fa-cloud-moon");
    }
}

const show_cannot_find = () => {
  content.innerHTML = '';
  get_html.classList.add("h-100");
  get_body.classList.add("h-100");
  get_body.classList.add("position-relative");
  content.classList.add("position-absolute");
  content.classList.add("top-50");
  content.classList.add("start-50");
  content.classList.add("translate-middle");
  content.innerHTML += `
    <div>
      <div class="earth_ctn d-flex justify-content-center mb-2">
        <i class="fa-solid fa-earth-americas"></i>
      </div>
      <h3 class="text-center">Sorry, we can not find your location...</h3>
        <h3 class="text-center">Please try again</h3>
    </div>
  `
}









  





