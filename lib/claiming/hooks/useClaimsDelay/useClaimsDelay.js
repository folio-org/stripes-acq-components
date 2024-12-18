import { useCallback } from 'react';

import { PIECE_STATUS } from '../../../constants';
import { usePiecesStatusBatchUpdate } from '../../../hooks';

export const useClaimsDelay = () => {
  const {
    isLoading,
    updatePiecesStatus,
  } = usePiecesStatusBatchUpdate();

  const delayClaims = useCallback(({ claimingInterval, pieceIds }) => {
    return updatePiecesStatus({
      data: {
        claimingInterval,
        pieceIds,
        receivingStatus: PIECE_STATUS.claimDelayed,
      },
    });
  }, [updatePiecesStatus]);

  return {
    isLoading,
    delayClaims,
  };
};
