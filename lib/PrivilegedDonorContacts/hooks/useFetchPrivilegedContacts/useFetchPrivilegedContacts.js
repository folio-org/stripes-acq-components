import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { batchRequest } from '../../../utils';
import {
  DEFAULT_DATA,
  PRIVILEGED_CONTACTS_API,
} from '../constants';

export const useFetchPrivilegedContacts = (privilegedContactIds = DEFAULT_DATA, options = {}) => {
  const ky = useOkapiKy();
  const namespace = useNamespace({ key: 'privileged-contacts' });

  const { isLoading, data } = useQuery(
    [namespace, privilegedContactIds],
    () => {
      return batchRequest(
        ({ params: searchParams }) => ky
          .get(PRIVILEGED_CONTACTS_API, { searchParams })
          .json()
          .then(({ contacts }) => contacts),
        privilegedContactIds,
      );
    },
    {
      enabled: Boolean(privilegedContactIds.length),
      ...options,
    },
  );

  return ({
    contacts: data || DEFAULT_DATA,
    isLoading,
  });
};
