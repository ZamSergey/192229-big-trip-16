import EditFormEvent from '../view/event-edit.js';
import EventView from '../view/event-view.js';
import {renderElement, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {isDatesEqual,isPriseEqual} from '../utils/event';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointContainer = null;
  #changeData = null;
  #changeMode = null;

  #eventViewComponent = null;
  #editFormComponent = null;

  // #resetFormView = null;
  // #isDefaultView = false;
  #mode = Mode.DEFAULT;
  #event = null;


  constructor(pointContainer, changeData, changeMode) {
    this.#pointContainer = pointContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    // this.#resetFormView = resetFormView;
  }

  init = (event) => {
    this.#event = event;
    // this.#isDefaultView = true;

    const prevEventViewComponent = this.#eventViewComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#eventViewComponent = new EventView(event);

    this.#editFormComponent = new EditFormEvent(event);

    this.#editFormComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editFormComponent.setDeleteClickHandler(this.#handleDeleteClick);

    this.#editFormComponent.setRollupBtnHandler(() => {
      this.#replaceFormToEvent();
    });

    this.#eventViewComponent.setRollupBtnHandler(() => {
      this.#replaceEventToForm();
    });

    this.#eventViewComponent.setFavoriteHandler(()=> {
      this.#changeFavoriteBtnHandler();
    });

    if (prevEventViewComponent === null) {
      renderElement(this.#pointContainer, this.#eventViewComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventViewComponent, prevEventViewComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }
    remove(prevEventViewComponent);
    remove(prevEditFormComponent);
  }

  update = (newEvent) => {
    const newPoint =  new EventView(newEvent);
    console.log('newPoint',newPoint)
    console.log('old',this.#eventViewComponent)
    replace(newPoint, this.#eventViewComponent);
    //???????????? ???????????? ??????????????
    this.#eventViewComponent.removeElement();
    //???????????????? ??????????
    this.#eventViewComponent = newPoint;
    //???????????? ???? ???????? ??????????????????????
    this.#eventViewComponent.setRollupBtnHandler(()=> {
      this.#replaceEventToForm();
    });
    this.#eventViewComponent.setFavoriteHandler(()=> {
      this.#changeFavoriteBtnHandler();
    });
  }


   #replaceFormToEvent = () => {
     replace(this.#eventViewComponent, this.#editFormComponent);
     // eslint-disable-next-line no-use-before-define
     document.removeEventListener('keydown',this.#escClickHandler);
     this.#mode = Mode.DEFAULT;
   };

  #replaceEventToForm = () => {
    replace( this.#editFormComponent,this.#eventViewComponent);
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('keydown',this.#escClickHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #escClickHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  };

  #handleFormSubmit = (update) => {
    // ??????????????????, ???????????????????? ???? ?? ???????????? ????????????, ?????????????? ???????????????? ?????? ????????????????????,
    // ?? ???????????? ?????????????? ?????????????????????? ???????????? - ???????? ?????????? ??????, ?????? PATCH-????????????????????
    console.log(update)
    const isMinorUpdate =
      !isDatesEqual(this.#event.dateStart, update.dateStart) ||
      !isDatesEqual(this.#event.dateEnd, update.dateEnd) ||
      !isPriseEqual(this.#event.price, update.price);

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToEvent();
  }


  #changeFavoriteBtnHandler = () => {
    //???????????? ???????????????? ifFavorite ?? ?????????????????? ?????????????????? ?? trip-presenter

    this.#event = Object.assign({}, this.#event, {isFavorite: !this.#event.isFavorite});

    this.#changeData(UserAction.UPDATE_POINT,UpdateType.MINOR,this.#event);
  };

  #renderEvent = () => {
    renderElement(this.#pointContainer, this.#eventViewComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editFormComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  }

  destroy = () => {
    remove(this.#editFormComponent);
    remove(this.#eventViewComponent);
  }

  #handleDeleteClick = (event) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      event,
    );
    // this.#replaceFormToEvent();
  }
}
