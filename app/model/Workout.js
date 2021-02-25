class Workout {
  constructor(_id, _date, _coords, _distance, _duration) {
    this.id = _id;
    this.date = _date;
    this.coords = _coords; // [lat, lng]
    this.distance = _distance; // km
    this.duration = _duration; // minutes
  }
}

export class Running extends Workout {
  constructor(_type, _id, _date, _coords, _distance, _duration, _cadence) {
    super(_id, _date, _coords, _distance, _duration);
    this.type = _type;
    this.cadence = _cadence;
    // min/km
    this.pace = (this.duration / this.distance).toFixed(1);
  }
}

export class Cycling extends Workout {
  constructor(_type, _id, _date, _coords, _distance, _duration, _elevation) {
    super(_id, _date, _coords, _distance, _duration);
    this.type = _type;
    this.elevation = _elevation;
    // km/h
    this.speed = (this.distance / (this.duration / 60)).toFixed(1);
  }
}
