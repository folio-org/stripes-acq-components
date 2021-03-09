import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'react-router-dom';

import useList from './useList';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('useList', () => {
  it('should not call API right away, but after location is changed', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      () => useList(false, jest.fn().mockResolvedValue(), null, 30),
    );

    expect(result.current.isLoading).toBe(false);

    useLocation.mockReturnValue({ search: '?workflowStatus=Pending' });
    rerender();

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
  });

  it('should call API right away and return records', async () => {
    const queryLoadRecords = jest.fn().mockResolvedValue({});
    const loadRecordsCB = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() => useList(true, queryLoadRecords, loadRecordsCB, 30));

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
  });
});
