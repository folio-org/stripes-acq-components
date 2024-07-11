import { useConsortiumInstitutions } from '../consortia';
import { useInstitutions } from '../useInstitutions';

/*
  Depending on the defined context (ECS or not), it loads the list of institutions for the current tenant or for all tenants of the consortium.
*/
export const useInstitutionsQuery = (options = {}) => {
  const {
    enabled: enabledOption = true,
    consortium = false,
    ...rest
  } = options;

  const tenantInstitutionsData = useInstitutions({
    ...rest,
    enabled: !consortium && enabledOption,
  });
  const consortiumInstitutionsData = useConsortiumInstitutions({
    ...rest,
    enabled: consortium && enabledOption,
  });

  const targetObject = consortium ? consortiumInstitutionsData : tenantInstitutionsData;

  return {
    institutions: targetObject.institutions,
    isFetching: targetObject.isFetching,
    isLoading: targetObject.isLoading,
  };
};
