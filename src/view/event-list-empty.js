import {createElement} from './render';

const createEventEmptyListTemplate = () => ('<p class="trip-events__msg">Click New Event to create your first point</p>');

export default class EvenEmptyListContainerView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEventEmptyListTemplate();
  }

  clearElement() {
    this.#element = null;
  }
}
