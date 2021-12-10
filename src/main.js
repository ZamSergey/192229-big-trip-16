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

renderElement(tripContainer, new TripInfoView().element, RenderPosition.AFTERBEGIN);
renderElement(menu, new ControlMenuView().element);
renderElement(filter, new TripFilterView().element);
renderElement(sorting, new TripSortView().element);

renderElement(sorting, new EventListContainerView().element);

const contentList = document.querySelector('.trip-events__list');


if(TEST_POINT_COUNT > 0) {
  generateNumPoints(TEST_POINT_COUNT).map((it) => {
    const editForm = new EditFormEvent(it).element;
    const eventView = new EventView(it).element;
    const currentEvent = {editForm,eventView};
    const escClickHandler = (evt) => {

      if (evt.key  === 'Escape') {
        contentList.replaceChild(currentEvent['eventView'],currentEvent['editForm']);
        document.removeEventListener('keydown',escClickHandler);
      }
    };

    editForm.querySelector('form').addEventListener('submit',(evt)=> {
      evt.preventDefault();
      contentList.replaceChild(eventView,editForm);
      document.removeEventListener('keydown',escClickHandler);
    });
    editForm.querySelector('.event__rollup-btn').addEventListener('click',()=> {
      contentList.replaceChild(eventView,editForm);
      document.removeEventListener('keydown',escClickHandler);
    });
    eventView.querySelector('.event__rollup-btn').addEventListener('click',()=> {

      contentList.replaceChild(editForm,eventView);
      document.addEventListener('keydown',escClickHandler);
    });

    renderElement(contentList, eventView);
  });
}
else {
  renderElement(contentList, new EvenEmptyListContainerView().element);

}

