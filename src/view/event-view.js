import dayjs from 'dayjs';
import {createElement} from './render';

const getDateFormat = (date,format) =>  date !== null ? dayjs(date).format(format) : '';

const createOfferTemplate = (offer) => (
  `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
);

const createOfferListTemplate = (offers) => {
  let offerList = '';
  for(const offer of offers) {
    if(offer.checked){
      offerList += createOfferTemplate(offer);
    }
  }
  return offerList;
};

const createEventTemplate = (event) => {
  const {dateStart, dateEnd, price, destination, offers,type} = event;
  const date1 = dayjs(dateStart);
  const date2 = dayjs(dateEnd);
  const duration = date2.diff(date1);
  const eventType = type.toLowerCase();

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getDateFormat(dateStart,'YYYY-MM-DD')}">${getDateFormat(dateStart,'MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getDateFormat(dateStart,'YYYY-MM-DDTHH:mm')}">${getDateFormat(dateStart,'HH.mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${getDateFormat(dateEnd,'YYYY-MM-DDTHH:mm')}">${getDateFormat(dateEnd,'HH.mm')}</time>
        </p>
        <p class="event__duration">${getDateFormat(duration,'HH.mm')}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOfferListTemplate(offers.offers)}
      </ul>
      <button class="event__favorite-btn event__favorite-btn--active" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
export const createPintsContainer = () => ('<ul class="trip-events__list"></ul>');

export default class EventView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEventTemplate();
  }

  clearElement() {
    this.#element = null;
  }
}
