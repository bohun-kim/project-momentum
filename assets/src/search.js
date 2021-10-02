const headerFormContainer = document.querySelector('.header__form-container');
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');

// addEventListener
searchButton.addEventListener('click', () => {
  headerFormContainer.classList.toggle('hide');
});

searchForm.addEventListener('submit', enterKey);

// function
function enterKey(e) {
  e.preventDefault();

  const inputValue = searchInput.value;
  window.open(`https://www.google.com/search?q=${inputValue}`, '_black');
}
