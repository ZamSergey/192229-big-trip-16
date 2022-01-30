import {FilterType} from './const';
import {isEventPast, isEventFuture} from './event';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter(() => true),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event))
};
