import TripFilterView from './view/trip-filters.js';
import ControlMenuView from './view/trip-controls.js';
import TripSortView from './view/trip-sort.js';
import EditFormEvent from './view/event-edit.js';
import TripInfoView from './view/trip-info.js';
import EventListContainerView from './view/event-list-view.js';
import EvenEmptyListContainerView from './view/event-list-empty.js';
import EventView from './view/event-view.js';
// import {renderElement,RenderPosition} from './view/render.js';
import {renderElement,RenderPosition,replace} from './utils/render.js';
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

renderElement(menu, new ControlMenuView());
renderElement(filter, new TripFilterView());
renderElement(sorting, new EventListContainerView());

const contentList = document.querySelector('.trip-events__list');

const renderEvent = (eventListElement, event) => {
  const eventView = new EventView(event);
  const editForm = new EditFormEvent(event);

  const replaceFormToEvent = () => {
    replace(eventView,editForm);
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown',escClickHandler);
  };

  const replaceEventToForm = () => {
    replace(editForm,eventView);
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('keydown',escClickHandler);
  };

  const escClickHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
    }
  };

  editForm.setFormSubmitHandler((evt)=> {
    evt.preventDefault();
    replaceFormToEvent();
  });

  editForm.setRollupBtnHandler(()=> {
    replaceFormToEvent();
  });

  eventView.setRollupBtnHandler(()=> {
    replaceEventToForm();
  });

  renderElement(eventListElement, eventView);
};

if(TEST_POINT_COUNT > 0) {
  renderElement(sorting, new TripSortView(),RenderPosition.AFTERBEGIN);
  renderElement(tripContainer, new TripInfoView(), RenderPosition.AFTERBEGIN);

  generateNumPoints(TEST_POINT_COUNT).map((it) => renderEvent(contentList,it));
}
else {
  renderElement(contentList, new EvenEmptyListContainerView());
}

