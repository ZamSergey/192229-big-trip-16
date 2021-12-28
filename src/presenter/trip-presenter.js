import EvenEmptyListContainerView from '../view/event-list-empty.js';
import {renderElement,RenderPosition,replace} from '../utils/render.js';
import TripEventsSortView from '../view/trip-sort.js';
import EventsContainerView from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';

const TEST_POINT_COUNT = 6;

export default class TripPresenter {
  #tripContainer = null;

  #tripEventsSortComponent = new TripEventsSortView();
  #eventsContainerComponent = new EventsContainerView();
  #eventEmptyListComponent = new EvenEmptyListContainerView();

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  #tripEvents = [];

  init = (tripEvents) => {
    this.#tripEvents = [...tripEvents];

    renderElement(this.#tripContainer, this.#tripEventsSortComponent);
    renderElement(this.#tripContainer,  this.#eventsContainerComponent);

    this.#renderTripEvents(this.#tripEvents);
  }

  #renderSort = () => {
    // Метод для рендеринга сортировки
  }

  #renderEvent = (event) => {
    new PointPresenter(this.#eventsContainerComponent).init(event);
  }

  #renderEvents = (events) => {
    events.map((it) => this.#renderEvent(it));
  }

  #renderNoEvents = () => {
    renderElement(this.#tripContainer, this.#eventEmptyListComponent);
  }

  #renderTripEvents = (events) => {
    if(TEST_POINT_COUNT > 0) {
      this.#renderEvents(events);
    }
    else {
      this.#renderNoEvents();
    }
  }

}

