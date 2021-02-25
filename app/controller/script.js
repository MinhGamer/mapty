'use strict';

// import App from '../model/App.js';
import { Running, Cycling } from '../model/Workout.js';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// const containerWorkouts = document.querySelector('.workouts');
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
    const containerWorkouts = document.querySelector('#containerWorkouts');

    //render workout from newest to oldest
    this.workoutList
      .slice()
      .reverse()
      .forEach(workout => {
        workoutHTML += `
        <li id="abc${workout.id}" class="workout workout--${workout.type}" >
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
            <span class="workout__value"> ${
              workout.type === 'running' ? workout.pace : workout.speed
            }</span>
            <span class="workout__unit">
            ${workout.type === 'running' ? 'min/km' : 'km/h'}
            </span>
          </div>
          <div class="workout__details">
            <span class="workout__icon"> ${
              workout.type === 'running' ? '🦶🏼' : '⛰'
            }</span>
            <span class="workout__value">${
              workout.type === 'running' ? workout.cadence : workout.elevation
            }</span>
            <span class="workout__unit">${
              workout.type === 'running' ? 'spm' : 'm'
            }</span>
          </div>
        </li>
        `;
      });

    containerWorkouts.innerHTML = workoutHTML;

    this.workoutList.forEach(workout => {
      document
        .getElementById(`abc${workout.id}`)
        .addEventListener('click', () => this._moveToPopup(workout.id));
    });
  }

  _renderWorkoutListOnMap() {
    this.workoutList.forEach(workout => {
      renderPopup(workout);
    });
  }

  _createWorkout() {
    const allNumber = (...inputs) => inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    //get input value from Form
    const distance = +document.querySelector('.form__input--distance').value;
    const duration = +document.querySelector('.form__input--duration').value;

    //generate id and date for workout object
    const id = Math.random().toFixed(6).toString();
    const date = new Date().toLocaleDateString();

    let workout = null;

    //check to create running or cycling object
    if (inputType.value === 'running') {
      const cadence = +document.querySelector('.form__input--cadence').value;

      //validate input
      if (
        !allNumber(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Please enter a positive number');

      workout = new Running(
        inputType.value,
        id,
        date,
        [workoutCoords[0], workoutCoords[1]],
        distance,
        duration,
        cadence
      );
    } else {
      //elevation can be negative number
      const elevation = +document.querySelector('.form__input--elevation')
        .value;

      //validate input
      if (
        !allNumber(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Please enter a number');

      workout = new Cycling(
        inputType.value,
        id,
        date,
        [workoutCoords[0], workoutCoords[1]],
        distance,
        duration,
        elevation
      );
    }

    //add object to workout list
    this.workoutList.push(workout);
    console.log(this.workoutList);
    renderPopup(workout);
    this._renderWorkoutList();

    //close workout Form
    closeWorkoutForm();

    saveLocalStorage();
  }

  _moveToPopup(id) {
    const workout = this.workoutList.find(workout => workout.id === id);
    mymap.setView(workout.coords, 13, {
      animate: true,
      duration: 0.5,
    });
  }
}

let mymap = {};

//a new coords when user click on the map
let workoutCoords = [];

const onMapClick = e => {
  const { lat, lng } = e.latlng;
  workoutCoords = [lat, lng];

  //render workout form
  form.classList.remove('hidden');
};

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const renderPopup = workout => {
  L.marker(workout.coords)
    .addTo(mymap)
    .bindPopup(
      L.popup({
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`,
      })
    )
    .setPopupContent(
      `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}  ${capitalizeFirstLetter(
        workout.type
      )} on ${workout.date}`
    )
    .openPopup();
};

const closeWorkoutForm = () => {
  form.reset();

  form.style.display = 'none';
  form.classList.add('hidden');
  setTimeout(() => (form.style.display = 'grid'), 1000);
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
};

//-----call function global-------- ---
const app = new App();

// window.moveToPopup = app._moveToPopup;
