'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const containerWorkouts = document.querySelector('.workouts');

let mymap = null;

const onMapClick = e => {
  const { lat, lng } = e.latlng;
  const coords = [lat, lng];

  createPopup(coords);
  renderForm();
};

const createPopup = coords => {
  //   L.popup()
  //     .setLatLng(coords)
  //     .setContent('I am a standalone popup.')
  //     .openOn(mymap);

  L.marker(coords)
    .addTo(mymap)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
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
  const form = document.querySelector('.form');
  form.classList.remove('hidden');
};

const createWorkout = () => {
  const inputType = document.querySelector('.form__input--type');
  const inputDistance = document.querySelector('.form__input--distance');
  const inputDuration = document.querySelector('.form__input--duration');
  const inputCadence = document.querySelector('.form__input--cadence');
  const inputElevation = document.querySelector('.form__input--elevation');

  const workout = {};
};

//-----call function global-----------
renderMap();
