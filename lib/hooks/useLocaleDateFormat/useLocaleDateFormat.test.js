import { renderHook } from '@testing-library/react-hooks';

import { getLocaleDateFormat } from '@folio/stripes/components';

import '../../../test/jest/__mock__';

import {
  useLocaleDateFormat,
} from './useLocaleDateFormat';

jest.mock('@folio/stripes/components', () => {
  return {
    getLocaleDateFormat: jest.fn(),
  };
});

describe('useLocaleDateFormat', () => {
  beforeEach(() => {
    getLocaleDateFormat.mockClear();
  });

  it('should return locale format from stripes getLocaleDateFormat', () => {
    const localeDateFormat = 'YYYY-MM-DD';

    getLocaleDateFormat.mockReturnValue(localeDateFormat);

    const { result } = renderHook(() => useLocaleDateFormat());

    expect(getLocaleDateFormat).toHaveBeenCalled();
    expect(result.current).toBe(localeDateFormat);
  });
});
