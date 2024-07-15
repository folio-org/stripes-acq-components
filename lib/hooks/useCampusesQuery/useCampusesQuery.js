import { useConsortiumCampuses } from '../consortia';
import { useCampuses } from '../useCampuses';

/*
  Depending on the defined context (ECS or not), it loads the list of campuses for the current tenant or for all tenants of the consortium.
*/
export const useCampusesQuery = (options = {}) => {
  const {
    enabled: enabledOption = true,
    consortium = false,
    ...rest
  } = options;

  const tenantCampusesData = useCampuses({
    ...rest,
    enabled: !consortium && enabledOption,
  });
  const consortiumCampusesData = useConsortiumCampuses({
    ...rest,
    enabled: consortium && enabledOption,
  });

  const targetObject = consortium ? consortiumCampusesData : tenantCampusesData;

  return {
    campuses: targetObject.campuses,
    isFetching: targetObject.isFetching,
    isLoading: targetObject.isLoading,
  };
};
