/* Developed collaboratively using AI (GitHub Copilot) */

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { PIECES_BATCH_STATUS_API } from '../../constants';
import { usePiecesStatusBatchUpdate } from './usePiecesStatusBatchUpdate';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePiecesStatusBatchUpdate', () => {
  const kyMock = {
    put: jest.fn(() => ({
      json: jest.fn(),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call ky.put with correct arguments', async () => {
    const { result } = renderHook(() => usePiecesStatusBatchUpdate(), { wrapper });
    const data = { status: 'Received' };

    await result.current.updatePiecesStatus({ data });

    expect(kyMock.put).toHaveBeenCalledWith(PIECES_BATCH_STATUS_API, { json: data });
  });
});
