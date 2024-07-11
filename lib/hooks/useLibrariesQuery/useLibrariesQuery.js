import { useConsortiumLibraries } from '../consortia';
import { useLibraries } from '../useLibraries';

/*
  Depending on the defined context (ECS or not), it loads the list of libraries for the current tenant or for all tenants of the consortium.
*/
export const useLibrariesQuery = (options = {}) => {
  const {
    enabled: enabledOption = true,
    consortium = false,
    ...rest
  } = options;

  const tenantLibrariesData = useLibraries({
    ...rest,
    enabled: !consortium && enabledOption,
  });
  const consortiumLibrariesData = useConsortiumLibraries({
    ...rest,
    enabled: consortium && enabledOption,
  });

  const targetObject = consortium ? consortiumLibrariesData : tenantLibrariesData;

  return {
    libraries: targetObject.libraries,
    isFetching: targetObject.isFetching,
    isLoading: targetObject.isLoading,
  };
};
