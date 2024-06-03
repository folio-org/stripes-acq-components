import { useConsortiumInstanceHoldings } from '../consortia';
import { useInstanceHoldings } from '../useInstanceHoldings';

/*
  Depending on the defined context (ECS or not), it loads the list of instance holdings for the current tenant or for all tenants of the consortium.
*/
export const useInstanceHoldingsQuery = (instanceId, options = {}) => {
  const {
    enabled: enabledOption = true,
    consortium = false,
    ...rest
  } = options;

  const tenantHoldingsData = useInstanceHoldings(instanceId, {
    ...rest,
    enabled: !consortium && enabledOption,
  });
  const consortiumHoldingsData = useConsortiumInstanceHoldings(instanceId, {
    ...rest,
    enabled: consortium && enabledOption,
  });

  const {
    holdings,
    totalRecords,
    isFetching,
    isLoading,
  } = (consortium ? consortiumHoldingsData : tenantHoldingsData);

  return {
    holdings,
    totalRecords,
    isFetching,
    isLoading,
  };
};
