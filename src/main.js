import {createTripFilterTemplate} from './view/trip-filters.js';
import {createTripControlMenuTemplate} from './view/trip-controls.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createEditFormEventTemplate} from './view/evant-edit.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createEventTemplate, createPintsContainer} from './view/event-view.js';
import {renderTemplate,RenderPosition} from './view/render.js';

const POINT_COUNT = 3;

const tripContainer = document.querySelector('.trip-main');
const menu = document.querySelector('.trip-controls__navigation');
const filter = document.querySelector('.trip-controls__filters');
const sorting = document.querySelector('.trip-events');

renderTemplate(tripContainer,createTripInfoTemplate(),RenderPosition.AFTERBEGIN);
renderTemplate(menu,createTripControlMenuTemplate());
renderTemplate(filter,createTripFilterTemplate());
renderTemplate(sorting,createTripSortTemplate());

renderTemplate(sorting,createPintsContainer());

const contentList = document.querySelector('.trip-events__list');
renderTemplate(contentList,createEditFormEventTemplate());

for (let i = 0; i < POINT_COUNT; i++ ) {
  renderTemplate(contentList,createEventTemplate());
}
