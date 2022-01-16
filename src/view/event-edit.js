import dayjs from 'dayjs';
import {EVENT_TYPES} from '../mock/event.js';
import SmartView from './smart-view.js';

const getDateFormat = (date,format) =>  date !== null ? dayjs(date).format(format) : '';

const createEventType = (event,number,isChecked) => {
  const eventLow = event.toLowerCase();
  return `<div class="event__type-item">
    <input id="event-type-${eventLow}-${number}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventLow}" ${isChecked ? 'checked':''}>
    <label class="event__type-label  event__type-label--${eventLow}" for="event-type-${eventLow}-${number}">${event}</label>
  </div>`;
};

const createEventList = (events,checkedType) => events.map((it, i) => {
  const isChecked = checkedType === it.toLowerCase();
  return createEventType(it, i, isChecked);
}).join('');

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

const createDestinationItem = (destination) => `<option>${destination}</option>`;

const createDescriptionList = (descriptionList) => descriptionList.map(({name}) => createDestinationItem(name) ).join('');

const createDescriptionSection = (destination) => (
  destination !== null
    ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
            ${createDescriptionImageList(destination)}
        </section>`
    : ''
);

const createEditFormEventTemplate = (data,destinationList) => {
  const {id, dateStart, dateEnd, price, currentDestination, currentOffers,currentType} = data;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventList(EVENT_TYPES,currentType)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${currentType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${currentDestination !== null ? currentDestination.name : ''}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createDescriptionList(destinationList)}
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
            ${createOfferList(currentOffers)}
            ${createDescriptionSection(currentDestination)}
      </section>
    </form>
  </li>`;
};

export default class EditFormEvent extends SmartView {
  #event = null;

  //Прокидываю справочники
  #offers = null;
  #destinations = null;

  constructor(event, offers, destinations) {
    super();
    // this.#event = event;
    this._data = EditFormEvent.parseEventToData(event);
    this.#offers = offers;
    this.#destinations = destinations;

    this.#setInnerHandlers();

  }

  #changeEventTypeHandler = (evt) => {
    evt.preventDefault();

    const newType = this.element.querySelector('.event__type-input:checked').value;

    if(evt.target.classList.contains('event__type-input')) {

      this.updateData({
        currentType: newType,
        currentOffers: this.#offers.find((it)=>it.type.toLowerCase() === newType)
      });
    }
  }

  #changeEventDestinationHandler = (evt) => {
    evt.preventDefault();
    if(this.#destinations.some((it)=>it.name === evt.target.value)) {
      this.updateData({
        currentDestination: this.#destinations.find((it)=>it.name === evt.target.value)
      });
    }
  }


  get template() {
    // return createEditFormEventTemplate(this.#event);

    return createEditFormEventTemplate(this._data, this.#destinations);
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }
  //востанавливаем работу обработчиков

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupBtnHandler(this._callback.rollupClick);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeEventTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeEventDestinationHandler);
  }

  updateData = (update,justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};
    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    // this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupBtnHandler);
  }

  static parseEventToData = (event) => ({...event,
    currentType: event.type,
    currentOffers: event.offers,
    currentDestination: event.destination,
  });

  static parseDataToEvent = (data) => {
    const event = {...data};
    event.type = data.currentType;
    event.offers = data.currentOffers;
    event.destination = data.currentDestination;
    delete event.currentType;
    delete event.currentOffers;
    delete event.currentDestination;
    return event;
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
