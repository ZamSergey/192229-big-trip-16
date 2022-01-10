import EvenEmptyListContainerView from '../view/event-list-empty.js';
import {renderElement,remove} from '../utils/render.js';
import TripEventsSortView from '../view/trip-sort.js';
import EventsContainerView from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../utils/const.js';
import {sortByTime,sortByPrice} from '../utils/event.js';

const TEST_POINT_COUNT = 6;

export default class TripPresenter {
  #tripContainer = null;

  #tripEventsSortComponent = new TripEventsSortView();
  #eventsContainerComponent = new EventsContainerView();
  #eventEmptyListComponent = new EvenEmptyListContainerView();

  #currentSort = SortType.DEFAULT;
  #sourcedTripEvents = [];
  #tripEvents = [];

  #pointPresenter = new Map();
  #currentOpenFormId = null;

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }
  //Для отладки нужен, потом убрать

  get pointPresenter() {
    return this.#pointPresenter;
  }

  init = (tripEvents) => {
    this.#tripEvents = [...tripEvents];
    this.#sourcedTripEvents = [...tripEvents];

    renderElement(this.#tripContainer, this.#tripEventsSortComponent);
    this.#tripEventsSortComponent.setSortChangeHandler(this.#handleSortChange);
    renderElement(this.#tripContainer,  this.#eventsContainerComponent);

    this.#renderTripEvents(this.#tripEvents);
  }



  #updateData = (data) => {
    // console.log('Пришло в updateData ',data);
    // Обновляю данные для изменившегося события(точки)
    const index = this.#tripEvents.findIndex((it) => it.id === data.id);
    if (index < 0) {
      return;
    }

    this.#tripEvents[index] = data;
    //Вызываю обновление измененного элемента
    const newPoint = this.#pointPresenter.get(data.id);
    newPoint.update(data);

  };

  #handleSortChange = (sortType) => {
    // - Сортируем задачи
    if (this.#currentSort === sortType) {
      return;
    }
    this.#sortTasks(sortType);
    // - Очищаем список
    //remove(this.#eventsContainerComponent);
    this.#clearEventList();
    // - Рендерим список заново
    this.#renderSort();
  }

  #clearEventList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    remove(this.#eventsContainerComponent);
  }
  #renderSort = () => {
    // Метод для рендеринга сортировки
    renderElement(this.#tripContainer,  this.#eventsContainerComponent);
    this.#renderTripEvents(this.#tripEvents);
  }

  #sortTasks = (sortType) => {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.TIME:
        this.#tripEvents.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#tripEvents.sort(sortByPrice);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#tripEvents = [...this.#sourcedTripEvents];
    }

    this.#currentSort = sortType;
  }

  #renderEvent = (event) => {
    const point = new PointPresenter(this.#eventsContainerComponent, this.#updateData, this.#resetFormView );
    point.init(event);
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

  #resetFormView = () => {
    this.#pointPresenter.forEach((it,key) => {
      this.#pointPresenter.get(key).resetViewToDefault();
    });
  }

}

