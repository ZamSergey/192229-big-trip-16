import dayjs from 'dayjs';
import {EVENT_TYPES} from '../mock/event.js';

const getDateFormat = (date,format) =>  dayjs(date).format(format);

const createEventType = (event,number) => {
  const eventLow = event.toLowerCase();
  return `<div class="event__type-item">
    <input id="event-type-${eventLow}-${number}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventLow}">
    <label class="event__type-label  event__type-label--${eventLow}" for="event-type-${eventLow}-${number}">${event}</label>
  </div>`;
};

const createEventList = (events) => {
  let eventList = '';
  for(let i = 0; i < events.length;i++) {
    eventList += createEventType(events[i],i);
  }
  return eventList;
};

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
  const offerData = offers.offers;
  let offerList = '';
  for(const offer of offerData) {
    offerList += createOffer(offer);
  }
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


const createDescriptionImageList = (images) => {
  let imageList = '';
  for(const image of images) {
    imageList += createDescriptionImage(image);
  }
  return `<div class="event__photos-container"><div class="event__photos-tape">${imageList}</div></div>`;
};

const createDescriptionSection = (eventDescription,destinationImages) => (
  `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${eventDescription}</p>
      ${destinationImages}
    </section>`
);

export const createEditFormEventTemplate = (event) => {
  const {dateStart, dateEnd, price, destination, offers,type} = event;

  const destinationImages = destination !== null
    ? createDescriptionImageList(destination.pictures)
    : '';
  const eventDescription = destination !== null
    ?  createDescriptionSection(destination.description,destinationImages)
    : '';

  const destinationName = destination !== null
    ? destination.name
    : '';

  const startTime = dateStart !== null
    ? getDateFormat(dateStart,'YY/MM/DD HH:mm')
    : '';

  const endTime = dateEnd !== null
    ? getDateFormat(dateEnd,'YY/MM/DD HH:mm')
    : '';

  const eventOffers = offers !== null
    ? createOfferList(offers)
    : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
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

            ${eventOffers}


            ${eventDescription}
      </section>
    </form>
  </li>`;
};
