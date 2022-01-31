import EvenEmptyListContainerView from '../view/event-list-empty.js';
import {renderElement,remove} from '../utils/render.js';
import TripEventsSortView from '../view/trip-sort.js';
import EventsContainerView from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';
import EventNewPresenter from './event-new-presenter.js';

import {sortByTime,sortByPrice} from '../utils/event.js';
import {SortType, UpdateType, UserAction,FilterType,RENDERED_POINT_COUNT} from '../utils/const.js';

import {RenderPosition} from '../utils/render';
import {filter} from '../utils/filter.js';


const TEST_POINT_COUNT = 6;

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #eventNewPresenter = null;

  // #tripEventsSortComponent = new TripEventsSortView();
  #tripEventsSortComponent = null;
  #eventsContainerComponent = new EventsContainerView();
  // #eventEmptyListComponent = new EvenEmptyListContainerView();
  #eventEmptyListComponent = null;

  #currentSort = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  /* #sourcedTripEvents = [];
  #tripEvents = [];*/

  #renderedPointsCount = RENDERED_POINT_COUNT;

  #pointPresenter = new Map();
  #currentOpenFormId = null;

  //Справочники
  #offers = null;
  #destinations = null;

  constructor(tripContainer, pointsModel, filterModel, offers, destinations) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#eventNewPresenter = new EventNewPresenter(this.#eventsContainerComponent, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    // const filterType = this.#filterModel.filter;
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    // const filteredPoints = filter[filterType](points);
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSort) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  init = () => {
    // renderElement(this.#tripContainer, this.#tripEventsSortComponent);

    // this.#tripEventsSortComponent.setSortChangeHandler(this.#handleSortChange);

    // this.#renderTripEvents(this.points);
    this.#renderTrip();
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

  createEvent = () => {
    this.#currentSort = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#eventNewPresenter.init();
  }


  #handleModeChange = () => {
    this.#eventNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
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
    remove(this.#eventsContainerComponent);
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

  #clearTrip = ({resetRenderedPointCount = false, resetSortType = false} = {}) => {
    const pointCount = this.points.length;

    this.#eventNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#tripEventsSortComponent);
    // remove(this.#eventEmptyListComponent);
    if (this.#eventEmptyListComponent) {
      remove(this.#eventEmptyListComponent);
    }
    if (resetRenderedPointCount) {
      this.#renderedPointsCount = RENDERED_POINT_COUNT;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedPointsCount = Math.min(pointCount, this.#renderedPointsCount);
    }

    if (resetSortType) {
      this.#currentSort = SortType.DEFAULT;
    }
  }

  #renderTrip = () => {

    renderElement(this.#tripContainer,  this.#eventsContainerComponent);

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
    const point = new PointPresenter(this.#eventsContainerComponent, this.#handleViewAction, this.#handleModeChange, this.#offers, this.#destinations );
    // const point = new PointPresenter(this.#eventsContainerComponent, this.#updateData, this.#resetFormView, this.#offers, this.#destinations );
    point.init(event);
    this.#pointPresenter.set(event.id, point);
  }

  #renderEvents = (events) => {
    events.map((it) => this.#renderEvent(it));
  }

  #renderNoEvents = () => {
    this.#eventEmptyListComponent = new EvenEmptyListContainerView(this.#filterType);
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

/*  #resetFormView = () => {
    this.#pointPresenter.forEach((it,key) => {
      this.#pointPresenter.get(key).resetViewToDefault();
    });
  }*/

}

