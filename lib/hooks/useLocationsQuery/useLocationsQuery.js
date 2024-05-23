import { useConsortiumLocations } from '../consortia';
import { useLocations } from '../useLocations';

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
