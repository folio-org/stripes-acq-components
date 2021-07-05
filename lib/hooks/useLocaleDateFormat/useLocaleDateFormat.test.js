import { renderHook } from '@testing-library/react-hooks';

import { getLocalFormat } from '@folio/stripes/components';

import '../../../test/jest/__mock__';

import {
  useLocaleDateFormat,
} from './useLocaleDateFormat';

jest.mock('@folio/stripes/components', () => {
  return {
    getLocalFormat: jest.fn(),
  };
});

describe('useLocaleDateFormat', () => {
  beforeEach(() => {
    getLocalFormat.mockClear();
  });

  it('should return locale format from stripes getLocalFormat', () => {
    const localeDateFormat = 'YYYY-MM-DD';

    getLocalFormat.mockReturnValue(localeDateFormat);

    const { result } = renderHook(() => useLocaleDateFormat());

    expect(getLocalFormat).toHaveBeenCalled();
    expect(result.current).toBe(localeDateFormat);
  });
});
