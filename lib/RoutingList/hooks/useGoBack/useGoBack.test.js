import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useGoBack } from './useGoBack';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
}));

const fallbackPath = '/orders';

describe('useGoBack', () => {
  it('should call `history.goBack` if location.key is present', async () => {
    const history = { goBack: jest.fn(), push: jest.fn() };
    const location = { key: 'test' };

    useHistory.mockReturnValue(history);
    useLocation.mockReturnValue(location);

    const { result } = renderHook(() => useGoBack(fallbackPath));

    result.current();

    expect(history.goBack).toHaveBeenCalled();
  });

  it('should call `history.push` with fallbackPath if location.key is not present', async () => {
    const history = { goBack: jest.fn(), push: jest.fn() };
    const location = { key: '' };

    useHistory.mockReturnValue(history);
    useLocation.mockReturnValue(location);

    const { result } = renderHook(() => useGoBack(fallbackPath));

    result.current();

    expect(history.push).toHaveBeenCalledWith(fallbackPath);
  });
});
