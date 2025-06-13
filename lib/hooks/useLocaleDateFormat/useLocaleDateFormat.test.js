import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { getLocaleDateFormat } from '@folio/stripes/components';

import { useLocaleDateFormat } from './useLocaleDateFormat';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  getLocaleDateFormat: jest.fn(),
}));

describe('useLocaleDateFormat', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return locale format from stripes getLocaleDateFormat', () => {
    const localeDateFormat = 'YYYY-MM-DD';

    getLocaleDateFormat.mockReturnValue(localeDateFormat);

    const { result } = renderHook(() => useLocaleDateFormat());

    expect(getLocaleDateFormat).toHaveBeenCalled();
    expect(result.current).toBe(localeDateFormat);
  });
});
