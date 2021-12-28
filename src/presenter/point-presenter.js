import EditFormEvent from '../view/event-edit.js';
import EventView from '../view/event-view.js';
import {renderElement,replace} from '../utils/render.js';


export default class PointPresenter {
  #pointContainer = null;

  #eventViewComponent = null;
  #editFormComponent = null;

  #event = null;
  constructor(pointContainer) {
    this.#pointContainer = pointContainer;
  }

  init = (event) => {
    this.#event = event;
    this.#renderEvent();
  }

  //Какой функционал нужно ставить в инициализацию?
  //Где лучше хранить параметры для инициализации?

  #renderEvent = () => {
    const eventView = new EventView(this.#event);
    const editForm = new EditFormEvent(this.#event);

    const replaceFormToEvent = () => {
      replace(eventView,editForm);
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('keydown',escClickHandler);
    };

    const replaceEventToForm = () => {
      replace(editForm,eventView);
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('keydown',escClickHandler);
    };

    const escClickHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToEvent();
      }
    };

    editForm.setFormSubmitHandler((evt)=> {
      evt.preventDefault();
      replaceFormToEvent();
    });

    editForm.setRollupBtnHandler(()=> {
      replaceFormToEvent();
    });

    eventView.setRollupBtnHandler(()=> {
      replaceEventToForm();
    });

    renderElement(this.#pointContainer, eventView);
  };
}
