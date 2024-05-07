import orderBy from 'lodash/orderBy';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIA_API,
  CONSORTIA_USER_TENANTS_API,
  LIMIT_MAX,
} from '../../../constants';

const DEFAULT_DATA = [];

const filterAffiliations = ({ assignedToCurrentUser = true, currentUserTenants = [] }) => (affiliations = []) => {
  if (!assignedToCurrentUser) return affiliations;

  const currentUserTenantsIds = currentUserTenants.map(({ id }) => id);

  return affiliations.filter(({ tenantId }) => currentUserTenantsIds.includes(tenantId));
};

export const useUserAffiliations = ({ userId } = {}, options = {}) => {
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'user-affiliations' });

  const consortium = stripes?.user?.user?.consortium;
  const currentUserTenants = stripes?.user?.user?.tenants;
  const {
    assignedToCurrentUser,
    enabled: enabledOption = true,
    ...queryOptions
  } = options;

  const searchParams = {
    userId,
    limit: LIMIT_MAX,
  };

  const enabled = Boolean(
    consortium?.centralTenantId
    && consortium?.id
    && userId
    && enabledOption,
  );

  const ky = useOkapiKy({ tenant: consortium?.centralTenantId });

  const {
    isFetching,
    isLoading,
    data = {},
    refetch,
  } = useQuery({
    queryKey: [namespace, userId, consortium?.id],
    queryFn: async () => {
      const { userTenants, totalRecords } = await ky.get(
        `${CONSORTIA_API}/${consortium.id}/${CONSORTIA_USER_TENANTS_API}`,
        { searchParams },
      ).json();

      return {
        userTenants: orderBy(userTenants, 'tenantName'),
        totalRecords,
      };
    },
    enabled,
    ...queryOptions,
  });

  const affiliations = useMemo(() => (
    filterAffiliations({ assignedToCurrentUser, currentUserTenants })(data.userTenants || DEFAULT_DATA)
  ), [assignedToCurrentUser, currentUserTenants, data.userTenants]);

  return ({
    affiliations,
    totalRecords: data.totalRecords || 0,
    isFetching,
    isLoading,
    refetch,
  });
};
