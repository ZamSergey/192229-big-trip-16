import TripFilterView from './view/trip-filters.js';
import ControlMenuView from './view/trip-controls.js';
import TripSortView from './view/trip-sort.js';
import EditFormEvent from './view/event-edit.js';
import TripInfoView from './view/trip-info.js';
import EventListContainerView from './view/event-list-view.js';
import EvenEmptyListContainerView from './view/event-list-empty.js';
import EventView from './view/event-view.js';
import {renderElement,RenderPosition,replace} from '../utils/render.js';
import {generateNumPoints} from './mock/event.js';

export default class TripPresenter {
  #tripContainer = null;

  #menuComponent = new ControlMenuView();
  #filterComponent = new TripFilterView();
  #sortingComponent = new EventListContainerView();


}

