import AbstractView from './abstract-view.js';
import {MenuItem} from '../utils/const.js';

const createTripControlMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="${MenuItem.LIST}">Table</a>
    <a class="trip-tabs__btn" href="${MenuItem.STATISTICS}">Stats</a>
  </nav>`
);

export default class ControlMenuView extends AbstractView {
  get template() {
    return createTripControlMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  setMenuItem = (menuItem) => {
    const item = this.element.querySelector(`[href=${menuItem}]`);

    if (item !== null) {
      item.classList.add('trip-tabs__btn--active');
    }
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(evt.target.href);
  }
}
