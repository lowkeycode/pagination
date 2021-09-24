const app = {};

// Global app variables
app.apiUrl = new URL("https://api.unsplash.com/search/photos");
app.apiKey = "K2sdLG2yACbMhSZqfdaiAzihh_avP6bmzIoN6C11n1Q";
app.page = 1;
app.pageNumEl = document.querySelector("p");

// RENDER PHOTOS
app.renderPhotos = function (photos) {
  const imgContainer = document.querySelector(".img-container");
  imgContainer.innerHTML = "";

  photos.forEach((photo) => {
    const markup = `
    <div class="img-container__card">
      <img src="${photo.urls.regular}" alt="">
    </div>
    `;

    imgContainer.insertAdjacentHTML("beforeend", markup);
  });
};

// ===================================== //
// ⌄⌄⌄⌄⌄⌄⌄ PAGINATION SOLUTION ⌄⌄⌄⌄⌄⌄
// ===================================== //

// PAGINATE RESULTS
app.resultsPerPage = function (pageNum) {
  const start = (pageNum - 1) * 10;
  const end = pageNum * 10;

  return app.searchResults.slice(start, end);
};

// ===================================== //
// ^^^^^^^ PAGINATION SOLUTION ^^^^^^
// ===================================== //

// GET PHOTOS
app.getPhotos = async function () {
  const unsplashEndpoint = new URL(app.apiUrl);
  unsplashEndpoint.search = new URLSearchParams({
    client_id: app.apiKey,
    query: "cats",
    orientation: "squarish",
    per_page: 30,
  });

  const res = await fetch(unsplashEndpoint);
  const data = await res.json();

  // Add full search to app obj
  app.searchResults = data.results;

  // Shitty error handling
  if (data.results.length > 30) return;

  const resultsByPage = app.resultsPerPage(app.page);

  console.log(resultsByPage);
  app.renderPhotos(resultsByPage);
};

app.init = function () {
  app.getPhotos();

  document.querySelector(".fa-chevron-right").addEventListener("click", () => {
    // Shitty Error handling
    if (app.page === 3) return;
    app.page++;
    app.pageNumEl.textContent = app.page;
    console.log(app.page);
    app.getPhotos(app.page);
  });

  document.querySelector(".fa-chevron-left").addEventListener("click", () => {
    if (app.page === 1) return;
    app.page--;
    app.pageNumEl.textContent = app.page;
    app.getPhotos(app.page);
  });
};

app.init();
