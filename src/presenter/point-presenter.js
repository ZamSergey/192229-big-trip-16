import EditFormEvent from '../view/event-edit.js';
import EventView from '../view/event-view.js';
import {renderElement, replace, remove} from '../utils/render.js';


export default class PointPresenter {
  #pointContainer = null;

  #eventViewComponent = null;
  #editFormComponent = null;
  #updateDataHandler = null;
  #resetFormView = null;
  #isDefaultView = false;

  #event = null;

  //Справочники
  #offers = null;
  #destinations = null;

  get isDefaultView() {
    return this.#isDefaultView;
  }

  constructor(pointContainer, updateDataHandler, resetFormView, offers, destinations) {
    this.#pointContainer = pointContainer;
    this.#updateDataHandler = updateDataHandler;
    this.#resetFormView = resetFormView;
    //Прокидываю справочники
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init = (event) => {
    this.#event = event;
    this.#isDefaultView = true;

    this.#eventViewComponent = new EventView(event);
    this.#editFormComponent = new EditFormEvent(event, this.#offers, this.#destinations);

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

  update = (newEvent) => {
    const newPoint =  new EventView(newEvent);
    replace(newPoint, this.#eventViewComponent);
    //Удаляю старый элемент
    this.#eventViewComponent.removeElement();
    //Добавляю новый
    this.#eventViewComponent = newPoint;
    //Ставлю на него обработчики
    this.#eventViewComponent.setRollupBtnHandler(()=> {
      this.#replaceEventToForm();
    });
    this.#eventViewComponent.setFavoriteHandler(()=> {
      this.#changeFavoriteBtnHandler();
    });
  }

  resetViewToDefault = () => {
    if(this.#isDefaultView) {
      return;
    }
    this.#editFormComponent.reset(this.#event);
    this.#replaceFormToEvent();
  };
  //Какой функционал нужно ставить в инициализацию?
  //Где лучше хранить параметры для инициализации?

   #replaceFormToEvent = () => {
     replace(this.#eventViewComponent, this.#editFormComponent);
     this.#isDefaultView = true;
     // eslint-disable-next-line no-use-before-define
     document.removeEventListener('keydown',this.#escClickHandler);
   };

  #replaceEventToForm = () => {
    this.#resetFormView();
    replace( this.#editFormComponent,this.#eventViewComponent);
    this.#isDefaultView = false;
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('keydown',this.#escClickHandler);
  };

  #escClickHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#event);
      this.#replaceFormToEvent();
      this.#isDefaultView = true;
    }
  };

  #changeFavoriteBtnHandler = () => {
    //Меняем значение ifFavorite и отправлем изменения в trip-presenter

    this.#event = Object.assign({}, this.#event, {isFavorite: !this.#event.isFavorite});

    this.#updateDataHandler(this.#event);
  };

  #renderEvent = () => {
    renderElement(this.#pointContainer, this.#eventViewComponent);
  };

  destroy = () => {
    remove(this.#editFormComponent);
    remove(this.#eventViewComponent);
  }
}
