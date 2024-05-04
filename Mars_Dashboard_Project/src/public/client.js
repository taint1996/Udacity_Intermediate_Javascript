let store = Immutable.Map({
  user: Immutable.Map({ name: 'Student' }),
  apod: '',
  rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
  rover: null
});

// add our markup to the page
const root = document.getElementById('root');

// Use ImmutableJS to merge newState from store
const updateStore = (state, newState) => {
  const updatedStore = Immutable.Map(state).merge(newState);
  render(root, updatedStore);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  if (!state.get('rover')) {
    return `
      <header>
          <div class="navbar">
              <div class="navbar-logo" onclick="handleBackToHome(event)">
                  <a href="#"><img src="./assets/images/banner.jpg" alt="NASA icon"></a>
                  <p>Mars</p>
              </div>
          </div>
      </header>
      
      <div class="container-banner" style="background-image: url(${BannerByDay(
        state
      )});">
          <div class="wrapper-buttons">
              <h1 class="padding-1rem-0">Discover Mars Rovers</h1>		
              <div class="padding-10px">${renderMenu(state)}</div>
          </div>
      </div>
      <footer>
          <div class="footer">
           <p>&copy; 2024 I Am Developer. All rights reserved.</p>
          </div>
      <footer>
  `;
  } else {
    return `
  <header>
      <div class="navbar">
          <div class="navbar-logo" onclick="handleBackToHome(event)">
             <a href="#"><img src="./assets/images/banner.jpg" alt="Mars icon"></a>
              <p>Mars</p>
           </div>
           <ul class="navbar-items">${renderMenuItems(state)}<ul>
      </div>
  </header>
      <div class="container">
          <h1 class="title">Discover everything to know about <span>${
            state.get('rover').latest_photos[0].rover.name
          }</span></h1>		
          <div class="images">${renderImages(state)}</div>
      </div>
      <footer>
        <div class="footer">
          <p>&copy; 2024 I Am Developer. All rights reserved.</p>
        </div>
      </footer>
  `;
  }
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
const handleClickItem = (e) => {
  const { id } = e.currentTarget;

  if (Array.from(store.get('rovers')).includes(id)) {
    getRoverImages(id, store);
  } else {
    console.log(`Rovers is not in my Store. Nice try!`);
  }
};

const handleBackToHome = (e) => {
  const newState = store.set('rover', null);
  updateStore(store, newState);
};

const renderMenu = (state) => {
  return `<ul class="flex">${renderButtonState(state)}</ul>`;
};

const renderMenuItems = (state) => {
  return Array.from(state.get('rovers'))
    .map(
      (item) =>
        `<li id=${item} onclick="handleClickItem(event)">
          <a ref="#">${uppercaseWord(`${item}`)}</a>
      </li>`
    )
    .join('');
};

const renderButtonState = (state) => {
  return Array.from(state.get('rovers'))
    .map(
      (item) =>
        `<li id=${item} class="btn-flex-item btn" onclick="handleClickItem(event)">
          <a ref="#">${uppercaseWord(`${item}`)}</a>
      </li>`
    )
    .join('');
};

const renderImages = (state) => {
  const stateRover = state.get('rover');

  // with join method returns an array without commas
  return Array.from(stateRover.latest_photos)
    .map(
      (item) =>
        `<div class="wrapper">
          <img src="${item.img_src}" />
          <div class="wrapper-info">
              <p><b>Upload date:</b> ${item.earth_date}</p>
              <p><b>Rover:</b> ${item.rover.name}</p>
              <p><b>State:</b> ${item.rover.status}</p>
              <p><b>Launch date:</b> ${item.rover.launch_date}</p>
              <p><b>Landing date:</b> ${item.rover.landing_date}</p>
          </div>
       </div>`
    )
    .slice(0, 50)
    .join('');
};

const BannerByDay = (state) => {
  if (!state.get('apod')) {
    getBannerFromApod(store);
  } else if (state.get('apod').image.media_type === 'video') {
    // fallback in case the image of the day is a video
    return `https://apod.nasa.gov/apod/image/2405/three_ats_beletsky.jpg`;
  } else {
    return `
          ${state.get('apod').image.url}
      `;
  }
};

const uppercaseWord = (word) => {
  return `${word[0].toUpperCase()}${word.slice(1)}`;
};

// ------------------------------------------------------  API CALLS

const getBannerFromApod = async (state) => {
  let { apod } = state;
  const response = await fetch(`http://localhost:3000/apod`);
  apod = await response.json();

  const newState = store.set('apod', apod);
  updateStore(store, newState);
  return apod;
};

const getRoverImages = async (roverName, state) => {
  try {
    const response = await fetch(`http://localhost:3000/rovers/${roverName}`);
    const roverData = await response.json();

    const newState = store.set('rover', roverData);
    updateStore(store, newState);

    return roverData;
  } catch (error) {
    console.error('Error fetching rover images:', error);
    throw error;
  }
};
