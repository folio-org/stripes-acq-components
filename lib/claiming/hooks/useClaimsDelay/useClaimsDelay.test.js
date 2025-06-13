import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { PIECE_STATUS } from '../../../constants';
import { usePiecesStatusBatchUpdate } from '../../../hooks';
import { useClaimsDelay } from './useClaimsDelay';

jest.mock('../../../hooks', () => ({
  usePiecesStatusBatchUpdate: jest.fn(),
}));

const mockUpdatePiecesStatus = jest.fn(() => Promise.resolve());

describe('useClaimsDelay', () => {
  beforeEach(() => {
    usePiecesStatusBatchUpdate.mockReturnValue({
      isLoading: false,
      updatePiecesStatus: mockUpdatePiecesStatus,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call updatePiecesStatus with correct parameters when delayClaims is called', async () => {
    const { result } = renderHook(() => useClaimsDelay());
    const claimingInterval = 30;
    const pieceIds = ['piece1', 'piece2'];

    await result.current.delayClaims({ claimingInterval, pieceIds });

    expect(mockUpdatePiecesStatus).toHaveBeenCalledWith({
      data: {
        claimingInterval,
        pieceIds,
        receivingStatus: PIECE_STATUS.claimDelayed,
      },
    });
  });
});
