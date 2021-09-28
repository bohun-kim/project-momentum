const todoBtn = document.querySelector('.container-bottom__todo-button');
const todoPosition = document.querySelector('.container-bottom__todo-position');
const todoForm = document.querySelector(
  '.container-bottom__todo-container--form'
);
const todoUl = document.querySelector('.container-bottom__todo-container--ul');
const todoInput = document.querySelector(
  '.container-bottom__todo-container--input'
);
const noList = document.querySelector('.no-list');

const TODOS = 'todo';
let todos = [];

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

// 편집 기능
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

// 배열에 추가
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

// localStorage 저장
function saveLocalStorage() {
  const todosString = JSON.stringify(todos);
  localStorage.setItem(TODOS, todosString);
}

// submit 이벤트 관리
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
