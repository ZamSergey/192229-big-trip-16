import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: get template');
  }

  updateElement = () => {}

  updateData = () => {}
}
