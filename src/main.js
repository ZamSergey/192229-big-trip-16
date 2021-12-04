import {createTripFilterTemplate} from './view/trip-filters.js';
import {createTripControlMenuTemplate} from './view/trip-controls.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createEditFormEventTemplate} from './view/event-edit.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createEventTemplate, createPintsContainer} from './view/event-view.js';
import {renderTemplate,RenderPosition} from './view/render.js';
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

renderTemplate(tripContainer, createTripInfoTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(menu, createTripControlMenuTemplate());
renderTemplate(filter, createTripFilterTemplate());
renderTemplate(sorting, createTripSortTemplate());

renderTemplate(sorting, createPintsContainer());

const contentList = document.querySelector('.trip-events__list');
// renderTemplate(contentList, createEditFormEventTemplate(generatePoint(1)));
// renderTemplate(contentList, createEditFormEventTemplate(EMPTY_DATA));


const testPoints = generateNumPoints(TEST_POINT_COUNT);

for (let i = 0; i < testPoints.length; i++ ) {
  if(i === 0) {
    renderTemplate(contentList, createEditFormEventTemplate(generatePoint(i)));
  }
  else {
    renderTemplate(contentList, createEventTemplate(testPoints[i]));
  }
}
