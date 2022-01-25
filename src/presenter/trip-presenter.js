import EvenEmptyListContainerView from '../view/event-list-empty.js';
import {renderElement,remove} from '../utils/render.js';
import TripEventsSortView from '../view/trip-sort.js';
import EventsContainerView from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';

import {sortByTime,sortByPrice} from '../utils/event.js';
import {SortType, UpdateType, UserAction} from '../utils/const.js';
import {RenderPosition} from "../utils/render";

const TEST_POINT_COUNT = 6;

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;

  // #tripEventsSortComponent = new TripEventsSortView();
  #tripEventsSortComponent = null;
  #eventsContainerComponent = new EventsContainerView();
  #eventEmptyListComponent = new EvenEmptyListContainerView();

  #currentSort = SortType.DEFAULT;
  /* #sourcedTripEvents = [];
  #tripEvents = [];*/

  #pointPresenter = new Map();
  #currentOpenFormId = null;

  //Справочники
  #offers = null;
  #destinations = null;

  constructor(tripContainer, pointsModel, offers, destinations) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSort) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }

    return this.#pointsModel.points;
  }

  init = () => {
    // renderElement(this.#tripContainer, this.#tripEventsSortComponent);

    // this.#tripEventsSortComponent.setSortChangeHandler(this.#handleSortChange);
    renderElement(this.#tripContainer,  this.#eventsContainerComponent);

    // this.#renderTripEvents(this.points);
    this.#renderTrip(this.points);
  }

  /*#updateData = (data) => {
    // console.log('Пришло в updateData ',data);
    // Обновляю данные для изменившегося события(точки)
    const index = this.points.findIndex((it) => it.id === data.id);
    if (index < 0) {
      return;
    }

    this.points[index] = data;
    //Вызываю обновление измененного элемента
    const newPoint = this.#pointPresenter.get(data.id);
    newPoint.update(data);

  };*/

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        // у меня в итоге получилось иначе чем в учебном примере и я пока не понял как переделать...
        this.#pointPresenter.get(data.id).update(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearTrip();
        this.#renderTrip();

        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetRenderedPointCount: true, resetSortType: true});
        this.#renderTrip();
        break;
    }
  }

  #handleSortChange = (sortType) => {
    // - Сортируем задачи
    if (this.#currentSort === sortType) {
      return;
    }
    this.#currentSort = sortType;
    // - Очищаем список
    //remove(this.#eventsContainerComponent);
    //this.#clearEventList();
    // - Рендерим список заново
    //this.#renderSort();

    this.#clearTrip({resetRenderedPointCount: true});
    this.#renderTrip();
  }


  /*
    #clearEventList = () => {
      this.#pointPresenter.forEach((presenter) => presenter.destroy());
      // remove(this.#eventsContainerComponent);
    }
  */

  #renderSort = () => {
    // Метод для рендеринга сортировки
    this.#tripEventsSortComponent = new TripEventsSortView(this.#currentSort);
    this.#tripEventsSortComponent.setSortChangeHandler(this.#handleSortChange);
    renderElement(this.#tripContainer,  this.#tripEventsSortComponent,RenderPosition.AFTERBEGIN);
    //this.#renderTripEvents(this.points);
  }

  #clearTrip = ({resetSortType = false} = {}) => {
    const pointCount = this.points.length;

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#tripEventsSortComponent);
    remove(this.#eventEmptyListComponent);

    if (resetSortType) {
      this.#currentSort = SortType.DEFAULT;
    }
  }

  #renderTrip = () => {

    const points = this.points;
    const eventCount = points.length;

    if (eventCount === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEvents(points);
  }

  #renderEvent = (event) => {
    const point = new PointPresenter(this.#eventsContainerComponent, this.#handleViewAction, this.#resetFormView, this.#offers, this.#destinations );
    // const point = new PointPresenter(this.#eventsContainerComponent, this.#updateData, this.#resetFormView, this.#offers, this.#destinations );
    point.init(event);
    this.#pointPresenter.set(event.id, point);
  }

  #renderEvents = (events) => {
    events.map((it) => this.#renderEvent(it));
  }

  #renderNoEvents = () => {
    renderElement(this.#tripContainer, this.#eventEmptyListComponent);
  }

/*  #renderTripEvents = (events) => {
    if(TEST_POINT_COUNT > 0) {
      this.#renderEvents(events);
    }
    else {
      this.#renderNoEvents();
    }
  }*/

  #resetFormView = () => {
    this.#pointPresenter.forEach((it,key) => {
      this.#pointPresenter.get(key).resetViewToDefault();
    });
  }

}

