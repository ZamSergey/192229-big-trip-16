import {createSiteFilterTemplate} from './view/filter.js';
import {createSiteMenuTemplate} from './view/menu.js';
import {createSiteSortingTemplate} from './view/sorting.js';
import {editFormTemplate} from './view/edit.js';
import {addFormTemplate} from './view/add.js';
import {createRoutePoint,createPintsContainer} from './view/route-point.js';
import {renderTemplate, RenderPosition} from './view/render.js';

const menu = document.querySelector('.trip-controls__navigation');
const filter = document.querySelector('.trip-controls__filters');
const sorting = document.querySelector('.trip-events');

renderTemplate(menu,createSiteMenuTemplate(),RenderPosition.BEFOREEND);
renderTemplate(filter,createSiteFilterTemplate(),RenderPosition.BEFOREEND);
renderTemplate(sorting,createSiteSortingTemplate(),RenderPosition.BEFOREEND);

renderTemplate(sorting,createPintsContainer(),RenderPosition.BEFOREEND);

const contentList = document.querySelector('.trip-events__list');
renderTemplate(contentList,editFormTemplate(),RenderPosition.BEFOREEND);
renderTemplate(contentList,createRoutePoint(),RenderPosition.BEFOREEND);

renderTemplate(contentList,addFormTemplate(),RenderPosition.BEFOREEND);
