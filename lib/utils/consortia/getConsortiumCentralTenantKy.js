import { extendKyWithTenant } from '../extendKyWithTenant';
import { getConsortiumCentralTenantId } from './getConsortiumCentralTenantId';

export const getConsortiumCentralTenantKy = (ky, stripes) => {
  return extendKyWithTenant(ky, getConsortiumCentralTenantId(stripes));
};
