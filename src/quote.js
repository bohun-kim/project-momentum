function createQuote(data) {
  const showQuote = document.querySelector('.container-bottom--quote');
  const showAuthor = document.querySelector('.container-bottom--author');

  const author = data.author;
  const content = data.content;

  showQuote.innerText = `${content}`;
  showAuthor.innerText = `-${author}`;
}

function loadQuote() {
  fetch('https://api.quotable.io/random?maxLength=25')
    .then((res) => res.json())
    .then((data) => {
      createQuote(data);
    })
    .catch((error) => console.log(error));
}

loadQuote();
