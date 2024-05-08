import { useStripes } from '@folio/stripes/core';

export const useCurrentUserTenants = () => {
  const stripes = useStripes();

  return stripes?.user?.user?.tenants;
};
