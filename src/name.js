const container = document.querySelector('.container-top');
const containerTopForm = document.querySelector('.container-top__greeting');
const containerTopTitle = document.querySelector(
  '.container-top__greeting--text'
);
const containerTopInput = document.querySelector(
  '.container-top__greeting--input'
);

function showValue(inputValue) {
  containerTopInput.classList.add('hide');
  const newDiv = document.createElement('div');
}

containerTopForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = containerTopInput.value;

  showValue(inputValue);
  saveValue(inputValue);
});
