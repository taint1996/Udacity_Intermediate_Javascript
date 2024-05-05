// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
  track_id: undefined,
  track_name: undefined,
  player_id: undefined,
  player_name: undefined,
  race_id: undefined
};

// We need our javascript to wait until the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  onPageLoad();
  setupClickHandlers();
});

async function onPageLoad() {
  console.log('Getting form info for dropdowns!');
  try {
    getTracks().then((tracks) => {
      const html = renderTrackCards(tracks);
      renderAt('#tracks', html);
    });

    getRacers().then((racers) => {
      const html = renderRacerCars(racers);
      renderAt('#racers', html);
    });
  } catch (error) {
    console.log('Problem getting tracks and racers ::', error.message);
    console.error(error);
  }
}

function setupClickHandlers() {
  let isPlayerSelected = false;
  let isTrackSelected = false;
  document.addEventListener(
    'click',
    function (event) {
      const { target } = event;
      console.log('target43 ', target);
      // Race track form field
      if (target.matches('.card.track')) {
        handleSelectTrack(target);
        store.track_id = target.id;
        store.track_name = target.innerHTML;
        isTrackSelected = true;
      }

      // Racer form field
      if (target.tagName === 'H4' && target.parentElement.matches('.card')) {
        const racerCard = target.parentElement;
        handleSelectRacer(racerCard);

        store.player_id = racerCard.id;
        store.player_name = racerCard.innerHTML;
        isPlayerSelected = true;
      }
      
      // Submit create race form
      if (target.matches('#submit-create-race')) {
        event.preventDefault();

        // start race
        isPlayerSelected && isTrackSelected
        ? handleCreateRace()
        : alert('Please make sure you have selected both a player and a track before hit submit button start the race');
      }
      
      // Handle acceleration click
      if (target.matches('#gas-peddle')) {
        handleAccelerate();
      }

      console.log('Store updated :: ', store);
    },
    false
  );
}

async function delay(ms) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    console.log("an error shouldn't be possible here");
    console.log(error);
  }
}

// ^ PROVIDED CODE ^ DO NOT REMOVE

// BELOW THIS LINE IS CODE WHERE STUDENT EDITS ARE NEEDED ----------------------------
// TIP: Do a full file search for TODO to find everything that needs to be done for the game to work

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
  console.log('in create race');

  // ? Get player_id and track_id from the store
  const { player_id, track_id } = store;

  // const race = TODO - call the asynchronous method createRace, passing the correct parameters
  const race = await createRace(player_id, track_id);
  // ? update the store with the race id in the response
  // TIP - console logging API responses can be really helpful to know what data shape you received
  console.log('RACE: ', race, store);
  //   store.race_id =
  store.race_id = race.ID;

  // render starting UI
  renderAt('#race', renderRaceStartView(store.track_name));

  // The race has been created, now start the countdown
  // ? call the async function runCountdown
  await runCountdown();
  // ? call the async function startRace
  // TIP - remember to always check if a function takes parameters before calling it!
  await startRace(store.race_id);
  // ? call the async function runRace
  await runRace(store.race_id);
}

function runRace(raceID) {
  return new Promise((resolve, reject) => {
    // ? use Javascript's built in setInterval method to get race info (getRace function) every 500ms
    const raceInterval = setInterval(() => {
      // Call the getRace function to fetch race information
      getRace(store.race_id)
        .then((raceResult) => {
          /* 
						TODO - if the race info status property is "in-progress", update the leaderboard by calling:
						renderAt('#leaderBoard', raceProgress(res.positions))
					*/
          if (raceResult.status === 'in-progress') {
            // If the race is in progress, update the leaderboard
            renderAt('#leaderBoard', raceProgress(raceResult.positions));
          } else if (raceResult.status === 'finished') {
            /* 
							TODO - if the race info status property is "finished", run the following:

							clearInterval(raceInterval) // to stop the interval from repeating
							renderAt('#race', resultsView(raceResult.positions)) // to render the results view
							resolve(res) // resolve the promise
						*/
            // If the race is finished, stop the interval and render the results view
            clearInterval(raceInterval);
            renderAt('#race', resultsView(raceResult.positions));
            resolve(raceResult);
          }
        })
        .catch((error) => {
          // remember to add error handling for the Promise
          // Reject the promise if there's an error
          clearInterval(raceInterval);
          reject(error);
        });
    }, 500);
  });
}

async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000);
    let timer = 3;

    return new Promise((resolve) => {
      // ? use Javascript's built in setInterval method to count down once per second
      const countdownInterval = setInterval(() => {
        // run this DOM manipulation inside the set interval to decrement the countdown for the user
        document.getElementById('big-numbers').innerHTML = --timer;

        // ? when the setInterval timer hits 0, clear the interval, resolve the promise, and return
        if (timer === 0) {
          clearInterval(countdownInterval);
          resolve();
        }
      }, 1000);
    });
  } catch (error) {
    console.log(error);
  }
}

function handleSelectRacer(target) {
  console.log('selected a racer', target.id);

  // Remove class "selected" from all racer options
  const selected = document.querySelector('#racers .selected');
  if (selected) {
    selected.classList.remove('selected');
  }

  // Add class "selected" to the h4 element within the current target
  const racerNameElement = target.querySelector('h4');
  racerNameElement.classList.add('selected');

  // Extract the racer name from the target element
  const racerName = racerNameElement.textContent;

  // Store the racer name in the store object
  store.player_id = target.id;
  store.player_name = { name: racerName };

  console.log('handleSelectRacer target ', target);
}

function handleSelectTrack(target) {
  console.log('selected track', target.id);

  // remove class selected from all track options
  const selected = document.querySelector('#tracks .selected');
  if (selected) {
    selected.classList.remove('selected');
  }

  // add class selected to current target
  target.classList.add('selected');
}

function handleAccelerate() {
  console.log('accelerate button clicked');
  // ? Invoke the API call to accelerate
  accelerate(store.race_id);
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
  if (!racers.length) {
    return `
			<h4>Loading Racers...</4>
		`;
  }

  const results = racers.map(renderRacerCard).join('');

  return `
		<ul id="racers">
			${results}
		</ul>
	`;
}

function renderRacerCard(racer) {
  const { id, driver_name, top_speed, acceleration, handling } = racer;
  // OPTIONAL: There is more data given about the race cars than we use in the game, if you want to factor in top speed, acceleration,
  // and handling to the various vehicles, it is already provided by the API!
  return `
      <li class="card" id="${id}">
        <h4>${driver_name}</h4>
        <p>
          <b>Top Speed: </b>
          ${top_speed}
        </p>
        <p>
          <b>Acceleration: </b>
          ${acceleration}
        </p>
        <p>
          <b>Handling: </b>
          ${handling}
        </p>    
      </li>
    `;
}

function renderTrackCards(tracks) {
  if (!tracks.length) {
    return `
			<h4>Loading Tracks...</4>
		`;
  }

  const results = tracks.map(renderTrackCard).join('');

  return `
		<ul id="tracks">
			${results}
		</ul>
	`;
}

function renderTrackCard(track) {
  const { id, name } = track;

  return `<h4 id="${id}" class="card track">${name}</h4>`;
}

function renderCountdown(count) {
  return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`;
}

function renderRaceStartView(track) {
  return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`;
}

function resultsView(positions) {
  userPlayer.driver_name += ' (you)';
  let count = 1;

  const results = positions.map((p) => {
    return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
  });

  return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			<h3>Race Results</h3>
			<p>The race is done! Here are the final results:</p>
			${results.join('')}
			<a href="/race">Start a new race</a>
		</main>
	`;
}

function raceProgress(positions) {
  console.log('position ', positions, store);
  let userPlayer = positions.find((e) => e.id === parseInt(store.player_id));
  console.log('user Player ', userPlayer);
  userPlayer.driver_name += ' (you)';

  positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
  let count = 1;

  const results = positions.map((p) => {
    return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
  });

  return `
		<table>
			${results.join('')}
		</table>
	`;
}

function renderAt(element, html) {
  const node = document.querySelector(element);

  node.innerHTML = html;
}

// ^ Provided code ^ do not remove

// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:3001';

function defaultFetchOpts() {
  return {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': SERVER
    }
  };
}

// ? Make a fetch call (with error handling!) to each of the following API endpoints

function getTracks() {
  console.log(`calling server :: ${SERVER}/api/tracks`);
  // GET request to `${SERVER}/api/tracks`

  // ? Fetch tracks
  // TIP: Don't forget a catch statement!
  return fetch(`${SERVER}/api/tracks`)
    .then((res) => res.json())
    .catch((err) =>
      console.log(`Problem with getTracks request:: ${JSON.stringify(err)}`)
    );
}

function getRacers() {
  // GET request to `${SERVER}/api/cars`
  // ? Fetch racers
  // TIP: Do a file search for "TODO" to make sure you find all the things you need to do! There are even some vscode plugins that will highlight todos for you
  return fetch(`${SERVER}/api/cars`)
    .then((res) => res.json())
    .catch((err) =>
      console.log(`Problem with getRacers request:: ${JSON.stringify(err)}`)
    );
}

function createRace(player_id, track_id) {
  player_id = parseInt(player_id);
  track_id = parseInt(track_id);
  const body = { player_id, track_id };

  return fetch(`${SERVER}/api/races`, {
    method: 'POST',
    ...defaultFetchOpts(),
    dataType: 'jsonp',
    body: JSON.stringify(body)
  })
    .then((res) => res.json())
    .catch((err) => console.log('Problem with createRace request::', err));
}

function getRace(id) {
  // GET request to `${SERVER}/api/races/${id}`
  return fetch(`${SERVER}/api/races/${id}`)
    .then((res) => res.json())
    .catch((err) =>
      console.log(`Problem with getRace request:: ${JSON.stringify(err)}`)
    );
}

function startRace(id) {
  return fetch(`${SERVER}/api/races/${id}/start`, {
    method: 'POST',
    ...defaultFetchOpts()
  })
    .then((res) => res.json())
    .catch((err) => console.log('Problem with getRace request::', err));
}

function accelerate(id) {
  // POST request to `${SERVER}/api/races/${id}/accelerate`
  // options parameter provided as defaultFetchOpts
  // no body or datatype needed for this request
  return fetch(`${SERVER}/api/races/${id}/accelerate`, {
    method: 'POST',
    ...defaultFetchOpts()
  })
    .then((res) => res.json())
    .catch((err) =>
      console.log(`Problem with accelerate request:: ${JSON.stringify(err)}`)
    );
}
