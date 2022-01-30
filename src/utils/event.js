import dayjs from 'dayjs';

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortByTime = (eventA, eventB) => {
  const weight = getWeightForNullDate(eventA.dateStart, eventB.dateStart);

  return weight ?? dayjs(eventA.dateStart).diff(dayjs(eventB.dateStart));
};

export const isEventPast = (event) => {
  console.log('isEventPast',event)
  return dayjs(event.dateEnd) < dayjs() ;
};
export const isEventFuture = (event) => dayjs(event.dateStart) > dayjs() ;


/*
export const sortTaskDown = (eventA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  return weight ?? dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
};
*/

export const sortByPrice = (eventA, eventB) => eventB.price - eventA.price;

export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB);
export const isPriseEqual = (priceA, priceB) => priceA === priceB;
