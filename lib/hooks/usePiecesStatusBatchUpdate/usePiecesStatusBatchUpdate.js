import { useCallback } from 'react';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { PIECES_BATCH_STATUS_API } from '../../constants';

export const usePiecesStatusBatchUpdate = () => {
  const ky = useOkapiKy();

  const mutationFn = useCallback(({ data }) => {
    return ky.put(PIECES_BATCH_STATUS_API, { json: data }).json();
  }, [ky]);

  const {
    mutateAsync,
    isLoading,
  } = useMutation({ mutationFn });

  return {
    isLoading,
    updatePiecesStatus: mutateAsync,
  };
};
