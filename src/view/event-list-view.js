import {createElement} from './render';

const createEventListContainerTemplate = () => ('<ul class="trip-events__list"></ul>');

export default class EventListContainerView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEventListContainerTemplate();
  }

  clearElement() {
    this.#element = null;
  }
}

