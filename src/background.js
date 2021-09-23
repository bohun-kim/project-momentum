const bottomAuthor = document.querySelector('.container-bottom--location');
const photographer = document.querySelector('.bg-photographer');
const containerBottom = document.querySelector('.container-bottom');

function showBackground(img) {
  const backBody = document.querySelector('body');
  const url = img.urls.regular;
  backBody.style.backgroundImage = `url('${url}')`;
  backBody.style.backgroundRepeat = 'no-repeat';
  backBody.style.backgroundSize = 'cover';
  backBody.style.backgroundPosition = 'center';
}

function showSource(img) {
  console.log(img);
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
