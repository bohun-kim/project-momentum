const container = document.querySelector('.container-top');
const containerTopForm = document.querySelector('.container-top__greeting');
const containerTopTitle = document.querySelector(
  '.container-top__greeting--text'
);
const containerTopInput = document.querySelector(
  '.container-top__greeting--input'
);
const editButton = document.querySelector('.container-top__greeting--edit');

const NAME = 'name';

function showValue(inputValue) {
  containerTopInput.classList.add('hide');
  const newDiv = document.createElement('div');
  newDiv.classList.add('showInput');
  newDiv.textContent = `${inputValue}`;
  containerTopTitle.textContent = `Have a Nice day`;
  editButton.classList.remove('hide');
  containerTopTitle.appendChild(newDiv);
}

function saveValue(inputValue) {
  localStorage.setItem(NAME, inputValue);
}

function handleSubmit(e) {
  e.preventDefault();
  const inputValue = containerTopInput.value;
  if (inputValue === '') {
    return;
  }

  showValue(inputValue);
  saveValue(inputValue);
}

function initName() {
  containerTopInput.classList.remove('hide');
  editButton.classList.add('hide');
}

function getData() {
  const localKey = localStorage.getItem(NAME);
  if (localKey === null) {
    initName();
    return;
  } else {
    showValue(localKey);
  }
}

function editItem(target) {
  const formText = document.querySelector('.showInput'); // ipnut 값으로 대체된 div
  const selection = window.getSelection();
  // window.getSelection 은 caret type으로 caret 는 텍스트 입력이 삽입 될 위치를 표시하는 화면에 표시되는 지표

  formText.setAttribute('contenteditable', true);
  selection.selectAllChildren(formText); //현재 위치를 알기 위함?
  selection.collapseToEnd();
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

function editName(e) {
  const target = e.target;
  if (target.dataset.type === 'edit') {
    editItem(target);
  }
}

function start() {
  getData();
  containerTopForm.addEventListener('submit', handleSubmit);
  editButton.addEventListener('click', editName);
}

start();
