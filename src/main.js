import TripFilterView from './view/trip-filters.js';
import ControlMenuView from './view/trip-controls.js';
import TripSortView from './view/trip-sort.js';
import EditFormEvent from './view/event-edit.js';
import TripInfoView from './view/trip-info.js';
import EventListContainerView from './view/event-list-view.js';
import EvenEmptyListContainerView from './view/event-list-empty.js';
import EventView from './view/event-view.js';
import {renderElement,RenderPosition} from './view/render.js';
import {generateNumPoints} from './mock/event.js';

const TEST_POINT_COUNT = 6;
/*const EMPTY_DATA = {type: null,
  destination: null,
  offers: null,
  id: null,
  is_favorite: null,
  dateStart: null,
  dateEnd: null,
  price: null};*/

const tripContainer = document.querySelector('.trip-main');
const menu = document.querySelector('.trip-controls__navigation');
const filter = document.querySelector('.trip-controls__filters');
const sorting = document.querySelector('.trip-events');

renderElement(menu, new ControlMenuView().element);
renderElement(filter, new TripFilterView().element);

renderElement(sorting, new EventListContainerView().element);
const contentList = document.querySelector('.trip-events__list');

const renderEvent = (eventListElement, event) => {
  const eventView = new EventView(event);
  const editForm = new EditFormEvent(event);

  const replaceFormToEvent = () => {
    contentList.replaceChild(eventView.element,editForm.element);
  };

  const replaceEventToForm = () => {
    contentList.replaceChild(editForm.element,eventView.element);
  };

  const escClickHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown',escClickHandler);
    }
  };

  editForm.element.querySelector('form').addEventListener('submit',(evt)=> {
    evt.preventDefault();
    replaceFormToEvent();
    document.removeEventListener('keydown',escClickHandler);
  });
  editForm.element.querySelector('.event__rollup-btn').addEventListener('click',()=> {
    replaceFormToEvent();
    document.removeEventListener('keydown',escClickHandler);
  });
  eventView.element.querySelector('.event__rollup-btn').addEventListener('click',()=> {

    replaceEventToForm();
    document.addEventListener('keydown',escClickHandler);
  });

  renderElement(eventListElement, eventView.element);
};

if(TEST_POINT_COUNT > 0) {
  renderElement(sorting, new TripSortView().element,RenderPosition.AFTERBEGIN);
  renderElement(tripContainer, new TripInfoView().element, RenderPosition.AFTERBEGIN);

  generateNumPoints(TEST_POINT_COUNT).map((it) => renderEvent(contentList,it));
}
else {
  renderElement(contentList, new EvenEmptyListContainerView().element);
}

