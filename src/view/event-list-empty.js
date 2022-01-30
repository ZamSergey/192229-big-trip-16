import AbstractView from './abstract-view.js';
import {FilterType} from '../utils/const.js';


const NoTasksTextType = {
  [FilterType.EVERYTHING]:  'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',

};

const createEventEmptyListTemplate = (filterType) => {
  const noTaskTextValue = NoTasksTextType[filterType];

  return `<p class="trip-events__msg">${noTaskTextValue}</p>`;
};

export default class EvenEmptyListContainerView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createEventEmptyListTemplate(this._data);
  }
}
