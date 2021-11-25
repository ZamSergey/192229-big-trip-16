import {createSiteFilterTemplate} from './view/filter.js';
import {createSiteMenuTemplate} from './view/menu.js';
import {createSiteSortingTemplate} from './view/sorting.js';
import {editFormTemplate} from './view/edit.js';
import {addFormTemplate} from './view/add.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createRoutePoint,createPintsContainer} from './view/route-point.js';
import {renderTemplate, RenderPosition} from './view/render.js';

const POINT_COUNT = 3;

const tripContainer = document.querySelector('.trip-main');
const menu = document.querySelector('.trip-controls__navigation');
const filter = document.querySelector('.trip-controls__filters');
const sorting = document.querySelector('.trip-events');

renderTemplate(tripContainer,createTripInfoTemplate(),RenderPosition.AFTERBEGIN);
renderTemplate(menu,createSiteMenuTemplate(),RenderPosition.BEFOREEND);
renderTemplate(filter,createSiteFilterTemplate(),RenderPosition.BEFOREEND);
renderTemplate(sorting,createSiteSortingTemplate(),RenderPosition.BEFOREEND);

renderTemplate(sorting,createPintsContainer(),RenderPosition.BEFOREEND);

const contentList = document.querySelector('.trip-events__list');
renderTemplate(contentList,editFormTemplate(),RenderPosition.BEFOREEND);

for (let i = 0; i < POINT_COUNT; i++ ) {
  renderTemplate(contentList,createRoutePoint(),RenderPosition.BEFOREEND);
}
