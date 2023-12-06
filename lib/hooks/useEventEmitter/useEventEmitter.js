import { EventEmitter } from '../../utils';

export const useEventEmitter = ({ singleton = true } = {}) => {
  return new EventEmitter({ singleton });
};
