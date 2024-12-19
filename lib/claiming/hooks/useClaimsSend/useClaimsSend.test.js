/* Developed collaboratively using AI (GitHub Copilot) */

import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { SEND_CLAIMS_API } from '../../../constants';
import { useClaimsSend } from './useClaimsSend';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useClaimsSend', () => {
  const kyPostMock = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      post: kyPostMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call ky.post with correct arguments when sendClaims is called', async () => {
    const { result } = renderHook(() => useClaimsSend(), { wrapper });
    const data = { claim: 'test' };

    kyPostMock.mockReturnValue({
      json: jest.fn().mockResolvedValue({}),
    });

    await result.current.sendClaims({ data });

    expect(kyPostMock).toHaveBeenCalledWith(SEND_CLAIMS_API, { json: data });
  });

  it('should handle errors when sendClaims is called', async () => {
    const { result } = renderHook(() => useClaimsSend(), { wrapper });

    const data = { claim: 'test' };
    const error = new Error('Failed to send claims');

    kyPostMock.mockReturnValue({
      json: jest.fn().mockRejectedValue(error),
    });

    await expect(result.current.sendClaims({ data })).rejects.toThrow(error);
  });
});
