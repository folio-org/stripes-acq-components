import { OKAPI_TENANT_HEADER } from '../constants';

export const extendKyWithTenant = (ky, tenantId) => {
  return ky.extend({
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set(OKAPI_TENANT_HEADER, tenantId);
        },
      ],
    },
  });
};