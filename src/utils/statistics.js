import {EVENT_TYPES} from '../utils/const.js';
import dayjs from 'dayjs';

const countSameTypeMoney = (data, checkType) => {
  let sum = 0;
  data.forEach(({type,price})=> {
    if(type === checkType) {
      sum += price;
    }
  });
  return sum;
};
const countSameType = (data, checkType) => {
  let sum = 0;
  data.forEach(({type})=> {
    if(type === checkType) {
      sum ++;
    }
  });
  return sum;
};

const countDurarionEvent = (data, checkType) => {
  let sum = 0;
  data.forEach(({type,dateStart,dateEnd})=> {
    if(type === checkType) {
      const date1 = dayjs(dateStart);
      const date2 = dayjs(dateEnd);
      sum += date2.diff(date1);
    }
  });
  return sum;
}


export const countMoneyForEachEvent = (data) => {
  const events = [];
  const price = [];
  EVENT_TYPES.forEach((elem) => { if (countSameTypeMoney(data,elem) > 0) {
    events.push(elem.toUpperCase());
    price.push(countSameTypeMoney(data,elem));
  }
  });
  return {'labels':events,'data':price};
};

export const countSameEvent = (data) => {
  const events = [];
  const numbers = [];
  EVENT_TYPES.forEach((elem) => { if (countSameType(data,elem) > 0) {
    events.push(elem.toUpperCase());
    numbers.push(countSameType(data,elem));
  }
  });
  return {'labels':events,'data':numbers};
};

export const countTimeEvent = (data) => {
  const events = [];
  const numbers = [];
  EVENT_TYPES.forEach((elem) => { if (countDurarionEvent(data,elem) > 0) {
    events.push(elem.toUpperCase());
    numbers.push(countDurarionEvent(data,elem));
  }
  });
  return {'labels':events,'data':numbers};
};
