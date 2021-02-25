'use strict';

// import App from '../model/App.js';
import { Running, Cycling } from '../model/Workout.js';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const containerWorkouts = document.querySelector('.workouts');
const form = document.querySelector('.form');
const inputType = document.querySelector('.form__input--type');

class App {
  constructor() {
    this.workoutList = [];
    this._renderMap();
  }

  _renderMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        res => {
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
          this._renderWorkoutListOnMap();
          this._renderWorkoutList();
        },
        err => {
          alert('Cound not get your position');
          console.log(err);
        }
      );
    }
  }

  _renderWorkoutList() {
    let workoutHTML = '';

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    this.workoutList.forEach(workout => {
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
  }

  _renderWorkoutListOnMap() {
    this.workoutList.forEach(workout => {
      renderPopup(workout.coords);
    });
  }

  _createWorkout() {
    const inputDistance = document.querySelector('.form__input--distance');
    const inputDuration = document.querySelector('.form__input--duration');
    const inputCadence = document.querySelector('.form__input--cadence');
    const inputElevation = document.querySelector('.form__input--elevation');

    const id = Math.random().toFixed(6).toString();
    const date = new Date().toLocaleDateString();

    let workout = {};

    if (inputType.value === 'running') {
      // workout.cadence = inputCadence.value;
      workout = new Running(
        inputType.value,
        id,
        date,
        [workoutCoords[0], workoutCoords[1]],
        inputDistance.value,
        inputDuration.value,
        inputCadence.value
      );
    } else {
      // workout.elevGain = inputElevation.value;
      workout = new Cycling(
        inputType.value,
        id,
        date,
        [workoutCoords[0], workoutCoords[1]],
        inputDistance.value,
        inputDuration.value,
        inputElevation.value
      );
    }

    this.workoutList.push(workout);
    renderPopup(workoutCoords);
    this._renderWorkoutList();
    closeWorkoutForm();
    clearWorkoutForm();
    saveLocalStorage();
  }
}

let mymap = {};

//a new coords when user click on the map
let workoutCoords = [];

const onMapClick = e => {
  const { lat, lng } = e.latlng;
  workoutCoords = [lat, lng];

  closeWorkoutList();
  renderWorkoutForm();
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

const closeWorkoutList = () => {
  const workoutListEle = document.querySelectorAll('.workouts li');
  workoutListEle.forEach(workoutEle => {
    workoutEle.style.display = 'none';
  });
};

const renderWorkoutForm = () => {
  form.classList.remove('hidden');
};

const closeWorkoutForm = () => {
  form.classList.add('hidden');
};

const clearWorkoutForm = () => {
  form.reset();
};

inputType.addEventListener('change', e => {
  document.querySelector('#inputCadence').classList.toggle('form__row--hidden');
  document
    .querySelector('#inputElevGain')
    .classList.toggle('form__row--hidden');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  app._createWorkout();
});

const saveLocalStorage = () => {
  localStorage.setItem('workoutList', JSON.stringify(app.workoutList));
};

const getLocalStorage = () => {
  app.workoutList = JSON.parse(localStorage.getItem('workoutList')) || [];

  // console.log(app.workoutList);
};

//-----call function global-------- ---
const app = new App();
