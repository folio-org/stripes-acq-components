import { useLocation } from 'react-router-dom';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import useList from './useList';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
}));

// TODO: It seems that this hook is not used in the codebase. Check if it can be removed or if it is used in some other part of the codebase.
describe.skip('useList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not call API right away, but after location is changed', async () => {
    const { result, rerender } = renderHook(
      () => useList(false, jest.fn().mockResolvedValue(), null, 30),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    useLocation.mockReturnValue({ search: '?workflowStatus=Pending' });
    rerender();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('should call API right away and return records', async () => {
    const queryLoadRecords = jest.fn().mockResolvedValue({});
    const loadRecordsCB = jest.fn();
    const { result } = renderHook(() => useList(true, queryLoadRecords, loadRecordsCB, 30));

    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await waitForNextUpdate();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
