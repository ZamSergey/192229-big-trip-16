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

    this.#eventViewComponent = new EventView(event);
    this.#editFormComponent = new EditFormEvent(event);

    this.#editFormComponent.setFormSubmitHandler(()=> {
      this.#replaceFormToEvent();
    });

    this.#editFormComponent.setRollupBtnHandler(()=> {
      this.#replaceFormToEvent();
    });

    this.#eventViewComponent.setRollupBtnHandler(()=> {
      this.#replaceEventToForm();
    });

    this.#eventViewComponent.setFavoriteHandler(()=> {
      this.#changeFavoriteBtnHandler();
    });

    this.#renderEvent();
  }

  //Какой функционал нужно ставить в инициализацию?
  //Где лучше хранить параметры для инициализации?

   #replaceFormToEvent = () => {
     replace(this.#eventViewComponent, this.#editFormComponent);
     // eslint-disable-next-line no-use-before-define
     document.removeEventListener('keydown',this.#escClickHandler);
   };

  #replaceEventToForm = () => {
    replace( this.#editFormComponent,this.#eventViewComponent);
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('keydown',this.#escClickHandler);
  };

  #escClickHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToEvent();
    }
  };

  #changeFavoriteBtnHandler = () => {
    this.#eventViewComponent.element.querySelector('.event__favorite-btn').classList.toggle('event__favorite-btn--active');
    console.log(this.#eventViewComponent.#event);

  };

  #renderEvent = () => {
    renderElement(this.#pointContainer, this.#eventViewComponent);
  };
}
