import { renderHook } from '@testing-library/react-hooks';

import {
  useResultsSRStatus,
} from './useResultsSRStatus';

describe('useResultsSRStatus', () => {
  it('should send "choose filters" message when hasFilters = false', async () => {
    const readerStatusMock = {
      sendMessage: jest.fn(),
    };
    const { rerender, result } = renderHook((props = {}) => useResultsSRStatus(props));

    const { readerStatusRef } = result.current;

    readerStatusRef.current = readerStatusMock;

    rerender({ hasFilters: false });

    expect(readerStatusMock.sendMessage).toHaveBeenCalledWith('stripes-smart-components.sas.noResults.noTerms');
  });

  it('should send "results count" message when hasFilters = true', async () => {
    const readerStatusMock = {
      sendMessage: jest.fn(),
    };
    const { rerender, result } = renderHook((props = {}) => useResultsSRStatus(props));

    const { readerStatusRef } = result.current;

    readerStatusRef.current = readerStatusMock;

    rerender({ hasFilters: true, resultsCount: 5 });

    expect(readerStatusMock.sendMessage).toHaveBeenCalledWith('stripes-acq-components.resultsCount');
  });
});
