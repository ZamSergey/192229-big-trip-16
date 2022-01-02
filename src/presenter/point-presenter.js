import EditFormEvent from '../view/event-edit.js';
import EventView from '../view/event-view.js';
import {renderElement, replace} from '../utils/render.js';


export default class PointPresenter {
  #pointContainer = null;

  #eventViewComponent = null;
  #editFormComponent = null;
  #updateDataHandler = null;

  #event = null;
  constructor(pointContainer, updateDataHandler) {
    this.#pointContainer = pointContainer;
    this.#updateDataHandler = updateDataHandler;
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

  update = (newEvent) => {
    console.log('newEvent',newEvent);
    const newPoint =  new EventView(newEvent);
    replace(newPoint, this.#editFormComponent);
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
    //this.#eventViewComponent.element.querySelector('.event__favorite-btn').classList.toggle('event__favorite-btn--active');
    //console.log(this.#eventViewComponent.#event);
    //Меняем значение ifFavorite и отправлем изменения в trip-presenter
    console.log('Было в точке где кликнули', this.#event);
    this.#event = Object.assign({}, this.#event, {isFavorite: !this.#event.isFavorite});
    console.log('Новый объект', this.#event);
    this.#updateDataHandler(this.#event);
  };

  #renderEvent = () => {
    renderElement(this.#pointContainer, this.#eventViewComponent);
  };
}
