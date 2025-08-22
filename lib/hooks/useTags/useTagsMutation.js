import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { TAGS_API } from '../../constants';

export const useTagsMutation = (options = {}) => {
  const { tenantId } = options;

  const ky = useOkapiKy({ tenant: tenantId });

  const {
    mutateAsync: createTag,
    isLoading,
  } = useMutation({
    mutationFn: ({ data }) => ky.post(TAGS_API, { json: data }).json(),
  });

  return {
    isLoading,
    createTag,
  };
};
