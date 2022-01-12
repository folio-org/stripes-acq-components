import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LIMIT_MAX } from '../../constants';

export const useIntegrationConfigs = ({ organizationId }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'organization-integrations' });

  const searchParams = {
    query: `configName==EDIFACT_ORDERS_EXPORT_${organizationId}*`,
    limit: LIMIT_MAX,
  };

  const { isFetching, data = {} } = useQuery(
    [namespace, organizationId],
    () => ky.get('data-export-spring/configs', { searchParams }).json(),
    { enabled: Boolean(organizationId) },
  );

  return ({
    integrationConfigs: data.configs || [],
    isFetching,
  });
};
