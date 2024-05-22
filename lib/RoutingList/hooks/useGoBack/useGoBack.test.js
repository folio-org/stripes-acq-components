import { renderHook } from '@testing-library/react-hooks';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import { useGoBack } from './useGoBack';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
}));

describe('useGoBack', () => {
  it('should call history.goBack if location.key is present', async () => {
    const history = { goBack: jest.fn(), push: jest.fn() };
    const location = { key: 'test' };

    useHistory.mockReturnValue(history);
    useLocation.mockReturnValue(location);

    const { result } = renderHook(() => useGoBack('test'));

    result.current();

    expect(history.goBack).toHaveBeenCalled();
  });

  it('should call history.push if location.key is not present', async () => {
    const history = { goBack: jest.fn(), push: jest.fn() };
    const location = { key: '' };

    useHistory.mockReturnValue(history);
    useLocation.mockReturnValue(location);

    const { result } = renderHook(() => useGoBack('test'));

    result.current();

    expect(history.push).toHaveBeenCalledWith('/orders/lines/view/test');
  });
});
