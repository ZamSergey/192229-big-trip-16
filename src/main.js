import TripFilterView from './view/trip-filters.js';
import ControlMenuView from './view/trip-controls.js';
import TripSortView from './view/trip-sort.js';
import {createEditFormEventTemplate} from './view/event-edit.js';
import TripInfoView from './view/trip-info.js';
import {createPintsContainer, EventView} from './view/event-view.js';
import {renderTemplate,renderElement,RenderPosition} from './view/render.js';
import {generateNumPoints,generatePoint} from './mock/event.js';

const TEST_POINT_COUNT = 25;
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

renderTemplate(sorting, createPintsContainer());

const contentList = document.querySelector('.trip-events__list');


const testPoints = generateNumPoints(TEST_POINT_COUNT);

for (let i = 0; i < testPoints.length; i++ ) {
  if(i === 0) {
    renderTemplate(contentList, createEditFormEventTemplate(generatePoint(i)));
  }
  else {
    renderElement(contentList, new EventView(testPoints[i]).element);
  }
}
