import { useConsortiumLocations } from '../consortia';
import { useLocations } from '../useLocations';

/*
  Depending on the defined context (ECS or not), it loads the list of locations for the current tenant or for all tenants of the consortium.
*/
export const useLocationsQuery = (options = {}) => {
  const {
    enabled: enabledOption = true,
    consortium = false,
    ...rest
  } = options;

  const tenantLocationsData = useLocations({
    ...rest,
    enabled: !consortium && enabledOption,
  });
  const consortiumLocationsData = useConsortiumLocations({
    ...rest,
    enabled: consortium && enabledOption,
  });

  const targetObject = consortium ? consortiumLocationsData : tenantLocationsData;

  return {
    locations: targetObject.locations,
    isFetching: targetObject.isFetching,
    isLoading: targetObject.isLoading,
  };
};
