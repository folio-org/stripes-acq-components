import { useCallback } from 'react';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { SEND_CLAIMS_API } from '../../../constants';

export const useClaimsSend = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const mutationFn = useCallback(({ data }) => {
    return ky.post(SEND_CLAIMS_API, { json: data }).json();
  }, [ky]);

  const {
    mutateAsync,
    isLoading,
  } = useMutation({ mutationFn });

  return {
    isLoading,
    sendClaims: mutateAsync,
  };
};
