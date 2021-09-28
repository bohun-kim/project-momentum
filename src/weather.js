// 화면에 출력
function showScreen(data) {
  const weatherDegree = document.querySelector('.weather-degree');
  const weatherPosition = document.querySelector('.weather-position');
  const weatherIcon = document.querySelector('.weather-icon');

  const weatherDeg = data.main.temp;
  const currPositioin = data.name;
  const id = data.weather[0].id;

  weatherDegree.innerHTML = `${weatherDeg} &#8451;`;
  weatherPosition.innerHTML = currPositioin;

  if (id === 800) {
    weatherIcon.src = 'assets/clear.svg';
  } else if (id >= 200 && id <= 232) {
    weatherIcon.src = 'assets/storm.svg';
  } else if (id >= 600 && id <= 622) {
    weatherIcon.src = 'assets/snow.svg';
  } else if (id >= 701 && id <= 781) {
    weatherIcon.src = 'assets/haze.svg';
  } else if (id >= 801 && id <= 804) {
    weatherIcon.src = 'assets/cloud.svg';
  } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
    weatherIcon.src = 'assets/rain.svg';
  }
}

// fetch api 불러오기
function loadWeather(coords) {
  let apiKey = '84b95cbd4384305777b36986af5da93a';
  let lat = coords.lat;
  let lon = coords.lon;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      showScreen(data);
    })
    .catch((error) => console.log('error', error));
}

// getCurrentPosition 에러
function error(err) {
  console.warn('cant access geo location');
}

// 첫 페이지 로드시 장치의 위치를 알아내기
function loadCoords() {
  navigator.geolocation.getCurrentPosition(success, error);
}

// getCurrentPosition 성공
function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  const coords = {
    lat,
    lon,
  };
  loadWeather(coords);
  saveCoords(coords);
}

let COORDS = 'coords';

function saveCoords(coords) {
  localStorage.setItem(COORDS, JSON.stringify(coords));
}

function init() {
  if (localStorage.getItem('COORDS') === null) {
    loadCoords();
  } else {
    COORDS = JSON.parse(localStorage.getItem('COORDS'));
  }
}

init();
