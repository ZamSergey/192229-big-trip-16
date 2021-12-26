import dayjs from 'dayjs';
import {EVENT_TYPES} from '../mock/event.js';
import AbstractView from './abstract-view.js';

const getDateFormat = (date,format) =>  date !== null ? dayjs(date).format(format) : '';

const createEventType = (event,number) => {
  const eventLow = event.toLowerCase();
  return `<div class="event__type-item">
    <input id="event-type-${eventLow}-${number}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventLow}">
    <label class="event__type-label  event__type-label--${eventLow}" for="event-type-${eventLow}-${number}">${event}</label>
  </div>`;
};

const createEventList = (events) => events.map((it, i) => createEventType(it, i)).join('');

const createOffer = (offer) => {
  const {checked,title,price,id} = offer;

  return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" ${checked ? 'checked': '' }>
              <label class="event__offer-label" for="event-offer-luggage-${id}">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>`;
};

const createOfferList = (offers) => {
  if (offers === null) {
    return '';
  }
  const offerList = offers.offers.map((it) => createOffer(it)).join('');
  return `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offerList}
          </div>
        </section>`;
};

const createDescriptionImage = (image) => {
  const {description,src} = image;
  return `<img class="event__photo" src="${src}" alt="${description}">`;
};


const createDescriptionImageList = (destination) => (
  destination !== null
    ? `<div class="event__photos-container"><div class="event__photos-tape">${destination.pictures.map((it) => createDescriptionImage(it)).join('')}</div></div>`
    : ''
);


const createDescriptionSection = (destination) => (
  destination !== null
    ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
            ${createDescriptionImageList(destination)}
        </section>`
    : ''
);

const createEditFormEventTemplate = (event) => {
  const {dateStart, dateEnd, price, destination, offers,type} = event;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventList(EVENT_TYPES)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination !== null ? destination.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateFormat(dateStart,'YY/MM/DD HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateFormat(dateEnd,'YY/MM/DD HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
            ${createOfferList(offers)}
            ${createDescriptionSection(destination)}
      </section>
    </form>
  </li>`;
};

export default class EditFormEvent extends AbstractView {
  #event = null;
  constructor(event) {
    super();
    this.#event = event;
  }

  get template() {
    return createEditFormEventTemplate(this.#event);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setRollupBtnHandler = (callback) => {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupBtnHandler);
  }

  #rollupBtnHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  }

}
