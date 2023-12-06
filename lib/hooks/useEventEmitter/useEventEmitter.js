import { useMemo } from 'react';

import { EventEmitter } from '../../utils';

export const useEventEmitter = ({ singleton = true } = {}) => {
  const eventEmitter = useMemo(() => new EventEmitter({ singleton }), [singleton]);

  return eventEmitter;
};
