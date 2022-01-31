// import TripFilterView from './view/trip-filters.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ControlMenuView from './view/trip-controls.js';
import {renderElement} from './utils/render.js';
import {RENDERED_POINT_COUNT} from './utils/const.js';
import {generateNumPoints, generateAllOffers, generateAllDestination} from './mock/event.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';

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

const filterModel = new FilterModel();
/*const filters = [
  {
    type: 'everything',
    name: 'EVERYTHING'
  }, {
    type: 'future',
    name: 'FUTURE'
  }, {
    type: 'past',
    name: 'PAST'
  },
];*/

renderElement(menu, new ControlMenuView());
// renderElement(filter, new TripFilterView());
// renderElement(filter, new TripFilterView(filters, 'everything'));

const tripEventsContainer = document.querySelector('.trip-events');

const points = generateNumPoints(RENDERED_POINT_COUNT);

const pointsModel = new PointsModel();
pointsModel.points = points;


const filterPresenter = new FilterPresenter(filter, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsContainer,pointsModel,filterModel,generateAllOffers(),generateAllDestination());

filterPresenter.init();
tripPresenter.init();


document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  console.log('main createEvent');
  tripPresenter.createEvent();
});
