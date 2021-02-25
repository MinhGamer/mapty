'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const containerWorkouts = document.querySelector('.workouts');
const form = document.querySelector('.form');
const inputType = document.querySelector('.form__input--type');

let mymap = {};

//a new coords when user click on the map
let workoutCoords = [];

//a list of workout
let workoutList = [];

const onMapClick = e => {
  const { lat, lng } = e.latlng;
  workoutCoords = [lat, lng];

  closeWorkoutList();
  renderForm();
};

const renderPopup = coords => {
  L.marker(coords)
    .addTo(mymap)
    .bindPopup(
      L.popup({
        autoClose: false,
        closeOnClick: false,
      })
    )
    .setPopupContent('A nice popup')
    .openPopup();
};

const renderWorkoutList = () => {
  let workoutHTML = '';

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  workoutList.forEach(workout => {
    workoutHTML = `
        <li class="workout workout--${workout.type}" data-id="1234567890">
          <h2 class="workout__title">${capitalizeFirstLetter(
            workout.type
          )} on ${new Date().toDateString()}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${(
              workout.duration / workout.distance
            ).toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${
              workout.type === 'running' ? workout.cadence : workout.elevGain
            }</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
        `;

    containerWorkouts.insertAdjacentHTML('beforeend', workoutHTML);
  });
};

const renderWorkoutListOnMap = () => {
  workoutList.forEach(workout => {
    renderPopup([workout.lat, workout.lng]);
  });
};

const closeWorkoutList = () => {
  const workoutListEle = document.querySelectorAll('.workouts li');
  workoutListEle.forEach(workoutEle => {
    workoutEle.style.display = 'none';
  });
};

const renderMap = () => {
  navigator.geolocation.getCurrentPosition(
    res => {
      //get lat and lng
      const { latitude, longitude } = res.coords;
      const coords = [latitude, longitude];

      //use Leaflet API to create map
      mymap = L.map('map').setView(coords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mymap);

      mymap.on('click', onMapClick);

      getLocalStorage();
      renderWorkoutListOnMap();
      renderWorkoutList();
    },
    err => {
      alert('Cound not get your position');
      console.log(err);
    }
  );
};

const renderForm = () => {
  form.classList.remove('hidden');
};

const closeForm = () => {
  form.classList.add('hidden');
};

const clearForm = () => {
  form.reset();
};

const createWorkout = () => {
  const inputDistance = document.querySelector('.form__input--distance');
  const inputDuration = document.querySelector('.form__input--duration');
  const inputCadence = document.querySelector('.form__input--cadence');
  const inputElevation = document.querySelector('.form__input--elevation');
  const id = Math.random().toString();
  const workout = {
    id: id,
    type: inputType.value,
    duration: inputDuration.value,
    distance: inputDistance.value,
    lat: workoutCoords[0],
    lng: workoutCoords[1],
  };

  if (inputType.value === 'running') {
    workout.cadence = inputCadence.value;
  } else {
    workout.elevGain = inputElevation.value;
  }

  workoutList.push(workout);
  renderPopup(workoutCoords);
  closeForm();
  clearForm();
  renderWorkoutList();
  saveLocalStorage();
};

inputType.addEventListener('change', e => {
  document.querySelector('#inputCadence').classList.toggle('form__row--hidden');
  document
    .querySelector('#inputElevGain')
    .classList.toggle('form__row--hidden');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  createWorkout();
});

const saveLocalStorage = () => {
  localStorage.setItem('workoutList', JSON.stringify(workoutList));
};

const getLocalStorage = () => {
  workoutList = JSON.parse(localStorage.getItem('workoutList')) || [];
};

//-----call function global-------- ---
renderMap();
