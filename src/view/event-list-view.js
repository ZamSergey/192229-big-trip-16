import AbstractView from './abstract-view.js';

const createEventListContainerTemplate = () => ('<ul class="trip-events__list"></ul>');

export default class EventsContainerView extends AbstractView {
  get template() {
    return createEventListContainerTemplate();
  }
}
