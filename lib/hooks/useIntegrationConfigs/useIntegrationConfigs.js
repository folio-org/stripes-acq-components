import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CQL_OR_OPERATOR,
  DATA_EXPORT_CONFIGS_API,
  LIMIT_MAX,
  ORGANIZATION_INTEGRATION_EXPORT_TYPES,
} from '../../constants';

const buildQuery = (organizationId) => {
  const configName = ORGANIZATION_INTEGRATION_EXPORT_TYPES
    .map(type => `"${type}_${organizationId}*"`)
    .join(` ${CQL_OR_OPERATOR} `);

  return `configName==(${configName})`;
};

const DEFAULT_DATA = [];

export const useIntegrationConfigs = ({ organizationId }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'organization-integrations' });

  const searchParams = {
    query: buildQuery(organizationId),
    limit: LIMIT_MAX,
  };

  const { isFetching, data = {} } = useQuery(
    [namespace, organizationId],
    ({ signal }) => ky.get(DATA_EXPORT_CONFIGS_API, { searchParams, signal }).json(),
    { enabled: Boolean(organizationId) },
  );

  return ({
    integrationConfigs: data.configs || DEFAULT_DATA,
    isFetching,
  });
};
