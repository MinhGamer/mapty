'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const containerWorkouts = document.querySelector('.workouts');
const form = document.querySelector('.form');
const inputType = document.querySelector('.form__input--type');

let mymap = null;

const onMapClick = e => {
  const { lat, lng } = e.latlng;
  const coords = [lat, lng];

  createPopup(coords);
  renderForm();
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

  inputType.addEventListener('change', e => {
    if (e.target.value === 'running') {
      document
        .querySelector('#inputCadence')
        .classList.remove('form__row--hidden');

      document
        .querySelector('#inputElevGain')
        .classList.add('form__row--hidden');
    } else {
      document
        .querySelector('#inputCadence')
        .classList.add('form__row--hidden');

      document
        .querySelector('#inputElevGain')
        .classList.remove('form__row--hidden');
    }

    renderForm();
  });
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

  if (inputType === 'running') {
    workout.cadence = inputCadence.value;
  } else {
    workout.elevGain = inputElevation.value;
  }

  console.log(workout);
};

//-----call function global-------- ---
renderMap();
