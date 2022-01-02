import EvenEmptyListContainerView from '../view/event-list-empty.js';
import {renderElement,replace,createElement} from '../utils/render.js';
import TripEventsSortView from '../view/trip-sort.js';
import EventsContainerView from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';

const TEST_POINT_COUNT = 6;

export default class TripPresenter {
  #tripContainer = null;

  #tripEventsSortComponent = new TripEventsSortView();
  #eventsContainerComponent = new EventsContainerView();
  #eventEmptyListComponent = new EvenEmptyListContainerView();

  #pointPresenter = new Map();


  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }
  //Для отладки нужен, потом убрать

  get pointPresenter() {
    return this.#pointPresenter;
  }

  #tripEvents = [];

  init = (tripEvents) => {
    this.#tripEvents = [...tripEvents];

    renderElement(this.#tripContainer, this.#tripEventsSortComponent);
    renderElement(this.#tripContainer,  this.#eventsContainerComponent);

    this.#renderTripEvents(this.#tripEvents);
    console.log(this.pointPresenter);
  }

  #renderSort = () => {
    // Метод для рендеринга сортировки
  }

  #updateData = (data) => {
    // console.log('Пришло в updateData ',data);
    // Обновляю данные для изменившегося события(точки)
    this.#tripEvents.find((element,index,array)=>{
      if (element.id === data.id) {
        // console.log('Было в данных ',element);
        array[index] = data;
      }
    });
    //Вызываю обновление измененного элемента
    const newPoint = this.#pointPresenter.get(data.id);
    newPoint.update(data);
    // Добавляю его коллекцию
    this.#pointPresenter.set(data.id, newPoint);
    // const newEvent = createElement(data);
    // const oldEvent = this.#pointPresenter.get(data.id);
    // this.#pointPresenter.delete(data.id);
    // replace(newEvent,oldEvent);
  };

  #renderEvent = (event) => {
    const point = new PointPresenter(this.#eventsContainerComponent, this.#updateData );
    point.init(event)
    this.#pointPresenter.set(event.id, point);
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

