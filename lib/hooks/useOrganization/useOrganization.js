import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { VENDORS_API } from '../../constants';

export const useOrganization = (id) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'organization' });

  const { isLoading, data } = useQuery(
    [namespace, id],
    () => ky.get(`${VENDORS_API}/${id}`).json(),
    { enabled: Boolean(id) },
  );

  return ({
    organization: data,
    isLoading,
  });
};
