'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const containerWorkouts = document.querySelector('.workouts');
const form = document.querySelector('.form');
const inputType = document.querySelector('.form__input--type');

let mymap = {};

//a new coords when user click on the map
let newCoords = [];

const onMapClick = e => {
  const { lat, lng } = e.latlng;
  newCoords = [lat, lng];

  renderForm();
  //   createPopup(coords);
};

const createPopup = coords => {
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

      // L.marker(coords)
      //   .addTo(map)
      //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      //   .openPopup();
      mymap.on('click', onMapClick);
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
  };

  if (inputType.value === 'running') {
    workout.cadence = inputCadence.value;
  } else {
    workout.elevGain = inputElevation.value;
  }

  console.log(workout);
  createPopup(newCoords);
  closeForm();
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

//-----call function global-------- ---
renderMap();
