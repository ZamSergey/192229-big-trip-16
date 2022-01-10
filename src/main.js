import TripFilterView from './view/trip-filters.js';
import ControlMenuView from './view/trip-controls.js';
import {renderElement} from './utils/render.js';
import {generateNumPoints} from './mock/event.js';
import TripPresenter from './presenter/trip-presenter.js';

const TEST_POINT_COUNT = 6;
/*const EMPTY_DATA = {type: null,
  destination: null,
  offers: null,
  id: null,
  is_favorite: null,
  dateStart: null,
  dateEnd: null,
  price: null};*/

const menu = document.querySelector('.trip-controls__navigation');
const filter = document.querySelector('.trip-controls__filters');

renderElement(menu, new ControlMenuView());
renderElement(filter, new TripFilterView());

const tripEventsContainer = document.querySelector('.trip-events');

new TripPresenter(tripEventsContainer).init(generateNumPoints(TEST_POINT_COUNT));
