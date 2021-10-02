let COORDS = 'coords';

// 화면에 출력
function showScreen(data) {
  const weatherDegree = document.querySelector('.weather-degree');
  const weatherPosition = document.querySelector('.weather-position');
  const weatherIcon = document.querySelector('.weather-icon');

  const weatherDeg = data.main.temp;
  const currPositioin = data.name;
  const id = data.weather[0].id;

  weatherDegree.innerHTML = `${weatherDeg} &#8451;`;
  weatherPosition.textContent = currPositioin;

  if (id === 800) {
    weatherIcon.src = 'assets/icons/clear.svg';
  } else if (id >= 200 && id <= 232) {
    weatherIcon.src = 'assets/icons/storm.svg';
  } else if (id >= 600 && id <= 622) {
    weatherIcon.src = 'assets/icons/snow.svg';
  } else if (id >= 701 && id <= 781) {
    weatherIcon.src = 'assets/icons/haze.svg';
  } else if (id >= 801 && id <= 804) {
    weatherIcon.src = 'assets/icons/cloud.svg';
  } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
    weatherIcon.src = 'assets/icons/rain.svg';
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

// 위치 정보 제공 거부
function error(err) {
  console.warn(err.message);
}

// 위치 정보 제공 동의
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

// localStorage 저장
function saveCoords(coords) {
  localStorage.setItem(COORDS, JSON.stringify(coords));
}

// 첫 페이지 로드시 장치의 위치 확인
function loadCoords() {
  navigator.geolocation.getCurrentPosition(success, error);
}

function init() {
  if (localStorage.getItem('COORDS') === null) {
    loadCoords();
  } else {
    JSON.parse(localStorage.getItem('COORDS'));
  }
}

init();
