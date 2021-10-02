# project-momentum

<img width="1440" alt="스크린샷 2021-09-29 오전 9 26 51" src="https://user-images.githubusercontent.com/75374915/135183301-6a04d658-30b0-4eb8-9086-e1e02365682f.png">

[프로젝트 보러가기](https://bohun-kim.github.io/project-momentum/ 'project-momentum')

# ⭐️ 목표

- api를 활용한 데이터 정보제공
- localStorage를 활용한 데이터 저장
- 데이터 저장 여부에 따른 상태변화

# 🛠 사용 기술 및 API

- HTML , CSS , JavaScript
- Openweathermap API (날씨 데이터)
- Unsplash API (배경화면 데이터)
- Quotable API (명언 데이터)

# 💻 주요 기능

```
1. 홈페이지 첫 입장시 사용자 위치정보제공 동의여부 및 이름 입력칸 출력
2. 위치정보제공 동의시 사용자 위치 날씨 출력
3. 저장된 이름 값을 화면에 출력과 수정 기능 제공
4. 구글 검색창
5. 실시간 현재 시간
6. 배경화면 랜덤생성 및 사진 제목 & 작가 이름 생성
7. 랜덤 명언 생성
8. Todo List
```

## 1. 홈페이지 첫 입장시 사용자 현재 위치 및 이름 입력칸 출력

<img width="1440" alt="스크린샷 2021-09-29 오전 10 14 28" src="https://user-images.githubusercontent.com/75374915/135188366-bd32f5f5-b18c-4b0c-9a6a-25a33a9fd619.png">

### ✅ 코드 확인하기

#### 1-1. 사용자 현재 위치 확인

> 첫 화면에서 장치의 위치가 localStorage에 저장되어있는지에 대한 여부에 대한 함수를 작성했습니다. </br>
> loadStorage 에 저장된 값이 null 이면 loadCoords() 를 실행시키고, 저장된 값이 있다면 parse 하여 값을 가져오게 하였습니다.

```js
function init() {
  if (localStorage.getItem('COORDS') === null) {
    loadCoords();
  } else {
    JSON.parse(localStorage.getItem('COORDS'));
  }
}

init();
```

> 현재 장치의 위치를 알기 위해 Navigator.geolocation.getCurrentPosition API 를 사용하였고, <br>
> 위치정보제공에 동의를 하면 받아온 GeolocationPosition 객체를 매개변수로 받아와 success 콜백함수를 실행시키게 되고 <br>
> 거부 하면 GeolocationPositionError 객체를 매개변수로 받아와 error 콜백함수를 실행시키게 됩니다.

```js
// 첫 페이지 로드시 장치의 위치 확인
function loadCoords() {
  navigator.geolocation.getCurrentPosition(success, error);
}
```

> 위치 정보 제공 동의를 하면 success를 콜백함수를 실행시킴과 동시에 GeolocationPosition 객체의 데이터 안에 있는 latitude(위도) , longitude(경도)를 받아와 변수에 할당하고 이 변수들을 coords 객체에 담아 **api를 불러오는 loadWeather(coords)** 와 **localStorage에 저장 할 수 있는 saveCoords(coords)** 에 각각 매개변수로 재할당하여 실행할 수 있도록 했습니다.

```js
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
```

> 위치 정보 제공 거부시 error 콜백함수를 실행시키게 되고 GeolocationPositionError 객체에 접근하여 안에 있는 message 프로퍼티를 출력하게 하였습니다.

```js
// 위치 정보 제공 거부
function error(err) {
  console.warn(err.message);
}
```

#### 1-2. 이름 입력칸

> localStorage에 값이 없을 시 initName()을 실행하고 값이 있다면 showValue(localKey)를 실행시켜 값을 불러옵니다.

```js
// localStorage에 값 받아오기
function getData() {
  const localKey = localStorage.getItem(NAME);
  if (localKey === null) {
    initName();
    return;
  } else {
    showValue(localKey);
  }
}
```

> initName()는 localStorage에 값이 없다면 실행되는 함수로 이름을 입력할 수 있는 input 값이 생성되고, 수정버튼을 지우는 기능을 합니다.

```js
// localStorage에 값 없을시 입력 input 생성
function initName() {
  containerTopInput.classList.remove('hide');
  editButton.classList.add('hide');
}
```

## 2. 위치정보제공 동의시 사용자 위치 날씨 출력

<img width="1440" alt="스크린샷 2021-09-29 오전 11 50 14" src="https://user-images.githubusercontent.com/75374915/135194917-0c01ef43-ca27-4ca2-b409-82dcf891d5e5.png">

### ✅ 코드 확인하기

> 위치정보제공 동의 시 success 콜백함수에서 loadWeather(coords) 함수를 실행시키게 됩니다. <br>
> 이 때 Openweathermap API 를 사용하였고 lat , lon , apiKey 변수를 이용하여 사용자의 위치에 관계하여 데이터를 받아오게 하였습니다. <br>
> api 주소를 객체화 시킨 데이터를 data 매개변수로 만들어 showScreen(data)를 실행시킵니다.

```js
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
```

> 객체화된 매개변수인 data안의 속성들에 접근하여 각각 현재 날씨에 대한 사진 , 현재 온도 , 지역 이름을 변수에 담아 화면에 출력할 수 있도록 나타내었습니다.

```js
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
```

> 위도와 경도를 저장하기 위해서 localStorage.setItem 에 keyName과 keyValue를 넣어주었습니다. keyValue는 success(position) 콜백함수 안에서 위도와 경도값이 담긴 coords 객체를 매개변수로 넣어주었습니다.

```js
// localStorage 저장
function saveCoords(coords) {
  localStorage.setItem(COORDS, JSON.stringify(coords));
}
```

## 3. 저장된 이름 값 화면에 출력과 수정 기능 제공

<p align ='center'><img  src = "https://user-images.githubusercontent.com/75374915/135215623-b6672f32-c84c-4043-9975-e089d697c6cb.gif"></p>

### ✅ 코드 확인하기

> 화면 이름 입력칸에 이름을 입력하면 이벤트가 발생하여 handleSubmit(e)가 함수가 실행됩니다. <br>
>
> > 이 함수는 화면 이름 입력칸에 입력하면 화면에 출력을 어떻게 할지에 대한 showValue(inputValue) 함수와 입력한 값을 localStorage에 저장할 수 있는 saveValue(inputValue) 함수가 있습니다. <br>
>
> > 두 함수 모두 input에 입력한 값을 매개변수로 가져갑니다.

```js
// 이름 입력 input에 값 입력시 화면에 출력 및 저장
function handleSubmit(e) {
  e.preventDefault();
  const inputValue = containerTopInput.value;
  if (inputValue === '') {
    return;
  }

  showValue(inputValue);
  saveValue(inputValue);
}
```

> 입력칸에 값을 넣어 showValue(inputValue) 함수가 실행되면 입력칸이 사라짐과 동시에 새로운 div가 생성되어 입력값이 화면에 출력하는 기능, "Thank you visiting our website!" 을 "Have a Nice day" 로 제목을 바꿔주는 기능, 수정 버튼을 추가해주는 기능을 추가합니다.

```js
// 값 입력시 화면 출력형태
function showValue(inputValue) {
  containerTopInput.classList.add('hide');
  const newDiv = document.createElement('div');
  newDiv.classList.add('showInput');
  newDiv.textContent = `${inputValue}`;
  containerTopTitle.textContent = `Have a Nice day`;
  editButton.classList.remove('hide');
  containerTopTitle.appendChild(newDiv);
}
```

> 입력칸에 저장된 값을 localStorage에 저장하는 saveValue(inputValue) 함수도 만들어 주었습니다.

```js
function saveValue(inputValue) {
  localStorage.setItem(NAME, inputValue);
}
```

> window.getSelection()을 이용하여 수정 버튼을 클릭했을 때 자동적으로 input 위치에서 변경 가능하도록 하였고 엔터 이벤트와 블러 이벤트를 만들어 값을 저장할 수 있도록 했습니다.

<p align ='center'><img  src = "https://user-images.githubusercontent.com/75374915/135214817-e2156106-c896-47cb-b6f0-8beb33404c44.gif"></p>

```js
// 수정 기능
function editItem(target) {
  const formText = document.querySelector('.showInput'); // ipnut 값으로 대체된 div
  const selection = window.getSelection();

  formText.setAttribute('contenteditable', true);
  selection.selectAllChildren(formText); // 선택한 위치의 텍스트를 모두 포함
  selection.collapseToEnd(); // 변경할 텍스트 끝에서 시작
  formText.focus();

  formText.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      if (formText.textContent === '' || formText.textContent.trim() === '') {
        getData();
        return;
      }
      formText.setAttribute('contenteditable', false);
      saveValue(formText.innerText);
    }
  });

  formText.addEventListener('blur', () => {
    if (formText.textContent === '' || formText.textContent.trim() === '') {
      getData();
      return;
    }
    formText.setAttribute('contenteditable', false);
    saveValue(formText.innerText);
  });
}

// 수정 버튼 핸들러
function editName(e) {
  const target = e.target;
  if (target.dataset.type === 'edit') {
    editItem(target);
  }
}
```

## 4. 구글 검색창

<p align ='center'><img  src = "https://user-images.githubusercontent.com/75374915/135248960-e0623193-f6a3-4d29-8e27-08d9b8d6578d.gif"></p>

### ✅ 코드 확인하기

> Search 버튼을 누르면 검색창이 열리도록 toggle 메서드를 사용하였고 검색창에 값을 입력하면 새 창을 열어 구글에 그 값이 입력되도록 했습니다.

```js
// addEventListener
searchButton.addEventListener('click', () => {
  headerFormContainer.classList.toggle('hide');
});

// function
function enterKey(e) {
  e.preventDefault();

  const inputValue = searchInput.value;
  window.open(`https://www.google.com/search?q=${inputValue}`, '_black');
}
```

## 5. 실시간 현재 시간

<img width="1440" alt="스크린샷 2021-09-29 오후 7 19 18" src="https://user-images.githubusercontent.com/75374915/135250625-8be7d639-9ca8-4240-8e00-d2620a7fe348.png">

### ✅ 코드 확인하기

> new Date() 객체를 이용하여 실시간으로 시간 데이터를 받아서 업데이트 하고 있으며<br>
> 시간이 한자리가 될 경우 0을 추가로 보여주게 했습니다.

```js
function checkTime(i) {
  return i < 10 ? `0${i}` : i;
}

function startTime() {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();

  // 시간과 분이 0보다 작아질 때 앞에 0 붙이기
  h = checkTime(h);
  m = checkTime(m);

  document.querySelector('.container-top--clock').textContent = `${h}:${m}`;

  setTimeout(() => {
    startTime();
  }, 1000);
}
startTime();
```

## 6. 배경화면 랜덤생성 및 사진 제목 & 작가 이름 생성

<img width="1440" alt="스크린샷 2021-09-29 오후 7 54 56" src="https://user-images.githubusercontent.com/75374915/135255467-c391cf45-905b-4559-8a46-56345d6b3f83.png">

<img width="1440" alt="스크린샷 2021-09-29 오후 7 54 37" src="https://user-images.githubusercontent.com/75374915/135255526-5298b64e-b875-4674-ab2f-e80123995bd8.png">

### ✅ 코드 확인하기

> 배경화면은 unsplash api를 사용하여 업데이트 하고 있습니다. <br>
> 화면 로드시 loadImages()를 호출 하고 unsplash에서 받아온 배경 데이터를 <br>
> showSource() 과 showBackground()에 인자값으로 전달합니다.

```js
function loadImages() {
  const API_KEY = 'YBb2CaJbxPP1pg5F-HY8r8yBqrQiF2U7W9vnyrFB_yw';

  fetch(
    `https://api.unsplash.com/search/photos?query=star&client_id=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      const images = data.results;
      const randomNum = Math.floor(Math.random() * images.length);
      const img = images[randomNum];

      showSource(img);
      showBackground(img);
    });
}

loadImages();
```

> showSource()는 매개변수 img에 접근하여 배경화면에 대한 상세 정보를 제공합니다. <br>
> 배경의 장소 , 배경의 사진 작가의 정보를 제공합니다.
> 버튼을 누르면 해당 사진 사이트에 들어갈 수 있습니다.

<p align ='center'><img  src = "https://user-images.githubusercontent.com/75374915/135260747-85a6b512-aeae-4e9d-ad0a-2d286f98ffb5.gif"></p>

```js
function showSource(img) {
  const sourceLocation = document.querySelector('.bg-location');
  const sourceAuthor = document.querySelector('.bg-photographer');
  const bottomLocation = document.querySelector('.container-bottom--location');

  const descLink = img.links.html;
  const userName = img.user.name;
  const userLocation = img.user.location;

  bottomLocation.setAttribute('href', `${descLink}`);
  sourceAuthor.textContent = userName;
  sourceLocation.textContent = userLocation;

  if (userLocation === null) {
    sourceLocation.textContent = 'No local information';
  }
}
```

> showBackGround() 또한 img 매개변수에 접근하여 화면의 크기를 정하여 배경화면에 지정할 수 있습니다.

```js
function showBackground(img) {
  const backBody = document.querySelector('body');
  const url = img.urls.regular;
  backBody.style.backgroundImage = `url('${url}')`;
  backBody.style.backgroundRepeat = 'no-repeat';
  backBody.style.backgroundSize = 'cover';
  backBody.style.backgroundPosition = 'center';
}
```

## 7. 랜덤 명언 생성

![Sep-29-2021 20-41-52](https://user-images.githubusercontent.com/75374915/135261585-3f7fb487-d010-429a-a60f-81036fe5aeaa.gif)

### ✅ 코드 확인하기

> 명언은 Quotable API를 이용하여 데이터를 받아오고 있습니다. <br>
> 받아온 데이터를 createQuote() 함수에 data 매개변수로 할당했습니다.

```js
function loadQuote() {
  fetch('https://api.quotable.io/random?maxLength=25')
    .then((res) => res.json())
    .then((data) => {
      createQuote(data);
    })
    .catch((error) => console.log(error));
}

loadQuote();
```

> createQoute()에 data 매개변수에 접근하여 명언과 명언을 만든 작가를 화면에 출력합니다.

```js
function createQuote(data) {
  const showQuote = document.querySelector('.container-bottom--quote');
  const showAuthor = document.querySelector('.container-bottom--author');

  const author = data.author;
  const content = data.content;

  showQuote.innerText = `${content}`;
  showAuthor.innerText = `-${author}`;
}
```

# 8. Todo List

### ✅ 코드 확인하기

> localStorage에 값이 없으면 Make Your List 👇 를 보여주기 위해 'hide' 클래스를 제거합니다.
> input에 submit 이벤트가 발생할 경우 handleSubmit()을 실행합니다.

<p align ='center'><img  src = "https://user-images.githubusercontent.com/75374915/135264072-9fdb1891-dda8-43be-8905-40ca9d5af97f.gif"></p>

```js
// localStorage 불러오기
function loadToDos() {
  const loadedToDos = localStorage.getItem(TODOS);
  if (loadedToDos === null || loadedToDos.length <= 2) {
    noList.classList.remove('hide');
  } else {
    noList.classList.add('hide');

    const parsedTodos = JSON.parse(loadedToDos);
    parsedTodos.forEach((todo) => {
      createItem(todo.inputValue, todo.checked);
    });
  }
}

function init() {
  loadToDos();
  // submit 리스트 저장
  todoForm.addEventListener('submit', handleSubmit);
  todoForm.addEventListener('click', (e) => {
    const target = e.target;
    if (target.dataset.type === 'checkbox') {
      checkList(target);
    } else if (target.dataset.type === 'edit') {
      editList(target);
    } else if (target.dataset.type === 'delete') {
      deleteList(target);
    }
  });

  todoBtn.addEventListener('click', () => {
    todoPosition.classList.toggle('active');
  });
}

init();
```

> input값이 submit 될 때 Make Your List 👇 는 사라집니다. <br>
> input값을 변수 inputValue 에 할당하고 createItem() 함수에 인자로 넣어줍니다. <br>
> input 창이 비어있을 때 return 하고, input을 입력했을 때 값이 지워져 새로 입력할 수 있습니다.

```js
// submit 이벤트 관리
const todoInput = document.querySelector(
  '.container-bottom__todo-container--input'
);

function handleSubmit(e) {
  e.preventDefault();
  noList.classList.add('hide');
  const inputValue = todoInput.value;
  if (inputValue === '') {
    return;
  }

  createItem(inputValue);
  todoInput.value = '';
}
```

> createItem() 은 매개변수를 이용하여 화면에 출력될 정보를 todos 에 push 해줍니다. <br>
> 이후에 push 된 todos를 saveLocalStorage() 에 저장해줍니다.

```js
// 배열에 추가
let todos = [];

function createItem(inputValue, checked) {
  const index = todos.length + 1;

  const li = document.createElement('li');
  li.classList.add('container-bottom__todo-container--li');
  li.setAttribute('data-id', `${index}`);

  const input = document.createElement('input');
  input.classList.add('container-bottom__todo-container--check');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('id', `item${index}`);

  const label = document.createElement('label');
  label.setAttribute('for', `item${index}`);
  label.setAttribute('data-type', 'checkbox');
  label.setAttribute('data-id', `${index}`);

  const span = document.createElement('span');
  span.classList.add('container-bottom__todo-container--span');
  span.textContent = inputValue;

  const sronly = document.createElement('span');
  sronly.setAttribute('class', 'sr-only');
  sronly.textContent = inputValue;

  const div = document.createElement('div');
  div.classList.add('container-bottom__todo-container--btns');

  const editBtn = document.createElement('button');
  editBtn.classList.add('container-bottom__todo-container--edit');
  editBtn.setAttribute('type', 'button');
  editBtn.setAttribute('data-type', 'edit');

  const delBtn = document.createElement('button');
  delBtn.classList.add('container-bottom__todo-container--delete');
  delBtn.setAttribute('type', 'button');
  delBtn.setAttribute('data-type', 'delete');

  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(span);
  li.appendChild(sronly);
  li.appendChild(div);
  div.appendChild(editBtn);
  div.appendChild(delBtn);
  todoUl.appendChild(li);

  const todo = {
    index,
    checked: checked >= 0 ? checked : 0,
    inputValue,
  };

  todos.push(todo);

  if (checked === 1) {
    input.setAttribute('checked', checked);
    label.setAttribute('class', 'checked');
  }

  saveLocalStorage();
}
```

> todos를 string 형태로 만들어 저장해줍니다.

```js
// localStorage 저장
function saveLocalStorage() {
  const todosString = JSON.stringify(todos);
  localStorage.setItem(TODOS, todosString);
}
```

> edit 버튼을 누르면 인자 target 데이터를 중심으로 enter 와 blur 이벤트를 통해 값을 수정할 수 있습니다. <br>
> input 이 빈 값일 때 원래 값이 적용됩니다.

<p align ='center'><img  src = "https://user-images.githubusercontent.com/75374915/135269903-4c1ae79f-18c7-4915-b10f-78be172a29ed.gif"></p>

```js
// 수정 기능
function editList(target) {
  const btnContainer = target.parentNode;
  const listContainer = btnContainer.parentNode;
  const inputValue = listContainer.querySelector(
    '.container-bottom__todo-container--span'
  );

  const selection = window.getSelection();
  selection.selectAllChildren(inputValue);
  selection.collapseToEnd();
  inputValue.setAttribute('contenteditable', true);
  inputValue.focus();

  inputValue.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (inputValue.textContent == '') {
        inputValue.textContent = todos[listContainer.dataset.id - 1].inputValue;
        return;
      }

      inputValue.setAttribute('contenteditable', false);
      todos[listContainer.dataset.id - 1].inputValue = inputValue.innerText;
      saveLocalStorage();
    }
  });

  inputValue.addEventListener('blur', (e) => {
    if (inputValue.textContent == '') {
      inputValue.textContent = todos[listContainer.dataset.id - 1].inputValue;
      return;
    }

    inputValue.setAttribute('contenteditable', false);
    todos[listContainer.dataset.id - 1].inputValue = inputValue.textContent;
    saveLocalStorage();
  });
}
```

> 체크 박스 클릭 시 완료를 의미하게 하기 위해 효과를 주었고 동시에 localStorage 에 check 값이 변경됩니다.

<p align ='center'><img  src = "https://user-images.githubusercontent.com/75374915/135271113-fc9c6688-e44f-4c35-b5e8-18ce691cefdb.gif"></p>

```js
// 체크박스 클릭시 기능
function checkList(target) {
  console.log(target);
  if (!target.classList.contains('checked')) {
    target.classList.add('checked');
    todos[target.dataset.id - 1].checked = 1;
    saveLocalStorage();
  } else {
    target.classList.remove('checked');
    todos[target.dataset.id - 1].checked = 0;
    saveLocalStorage();
  }
}
```

> 삭제 버튼 클릭 시 removeChild() 를 통해 화면에서 삭제할 수 있도록 했습니다.
> 삭제 버튼을 눌렀을 때 listContainer 데이터의 값과 todos 배열 안에 index 의 값을 비교하여 일치하는 데이터를 제외한 나머지 데이터를 반환합니다. <br>
> 빈 배열일 경우 다시 "Make Your List 👇" 텍스트를 보여줍니다.

<p align ='center'><img  src = "https://user-images.githubusercontent.com/75374915/135271702-f8959401-8c16-49d1-b9cd-4297057daf51.gif"></p>

```js
// 삭제 기능
function deleteList(target) {
  const btnContainer = target.parentNode;
  const listContainer = btnContainer.parentNode;
  todoUl.removeChild(listContainer);

  const deleteTodos = todos.filter((todo) => {
    return todo.index !== parseInt(listContainer.dataset.id);
  });

  todos = deleteTodos;

  if (todos.length <= 0) {
    noList.classList.remove('hide');
  }

  saveLocalStorage();
}
```
