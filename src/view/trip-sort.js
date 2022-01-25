import SmartView from './smart-view.js';
import {SortType} from '../utils/const.js';

const createTripSortTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day"  ${currentSortType === SortType.DEFAULT ? 'checked':''}>
      <label class="trip-sort__btn" for="sort-day" data-sort-by="${SortType.DEFAULT}">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time"  ${currentSortType === SortType.TIME ? 'checked':''}>
      <label class="trip-sort__btn" for="sort-time"  data-sort-by="${SortType.TIME}">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price"  ${currentSortType === SortType.PRICE ? 'checked':''}>
      <label class="trip-sort__btn" for="sort-price"  data-sort-by="${SortType.PRICE}">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`
);

export default class TripSortView extends SmartView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createTripSortTemplate(this.#currentSortType);
  }

  setSortChangeHandler = (callback) => {
    this._callback.sortChange = callback;
    this.element.addEventListener('click', this.#sortChangeHandler);
  }

  #sortChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    if (evt.target.dataset.sortBy) {
      this._callback.sortChange(evt.target.dataset.sortBy);
    }
  }
}
