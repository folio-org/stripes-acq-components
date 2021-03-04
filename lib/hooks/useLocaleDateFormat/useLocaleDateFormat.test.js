import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import {
  useLocaleDateFormat,
} from './useLocaleDateFormat';

describe('useLocaleDateFormat', () => {
  it('should return locale format (en-US from mock)', () => {
    const { result } = renderHook(() => useLocaleDateFormat());

    expect(result.current).toBe('MM/DD/YYYY');
  });
});
