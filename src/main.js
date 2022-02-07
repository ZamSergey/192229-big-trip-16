// import TripFilterView from './view/trip-filters.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ControlMenuView from './view/trip-controls.js';
import {renderElement} from './utils/render.js';
import {RENDERED_POINT_COUNT,MenuItem} from './utils/const.js';
import {generateNumPoints, generateAllOffers, generateAllDestination} from './mock/event.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import StatsView from './view/stats-view.js';

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
const controlMenuComponent = new ControlMenuView();
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

renderElement(menu, controlMenuComponent);


const handleEventNewFormClose = () => {
  controlMenuComponent.element.querySelector(`[href=${MenuItem.LIST}]`).classList.remove('trip-tabs__btn--active');
  controlMenuComponent.element.querySelector(`[href=${MenuItem.STATISTICS}]`).classList.remove('trip-tabs__btn--active');
  controlMenuComponent.setMenuItem(MenuItem.LIST);
};


const tripEventsContainer = document.querySelector('.trip-events');

const points = generateNumPoints(RENDERED_POINT_COUNT);

const pointsModel = new PointsModel();
pointsModel.points = points;


const filterPresenter = new FilterPresenter(filter, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsContainer,pointsModel,filterModel,generateAllOffers(),generateAllDestination());

filterPresenter.init();
tripPresenter.init();

renderElement(tripEventsContainer, new StatsView(pointsModel.points));

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.LIST:
      tripPresenter.init();
      filterPresenter.init();
      break;
    case MenuItem.STATISTICS:
      filterPresenter.destroy();
      tripPresenter.destroy();
      break;
  }
};

controlMenuComponent.setMenuClickHandler(handleSiteMenuClick);
document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
