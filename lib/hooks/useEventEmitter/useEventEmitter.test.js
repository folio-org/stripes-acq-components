import { renderHook } from '@testing-library/react-hooks';

import { EventEmitter } from '../../utils';
import { useEventEmitter } from './useEventEmitter';

describe('useEventEmitter', () => {
  it('should return event emitter instance', async () => {
    const { result } = renderHook(() => useEventEmitter());

    expect(result.current).toBeInstanceOf(EventEmitter);
  });
});
