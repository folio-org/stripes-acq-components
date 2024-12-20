import { HOLDINGS_API } from '../constants';
import { extendKyWithTenant } from './extendKyWithTenant';
import {
  getHoldingsAndLocations,
  getHoldingsAndLocationsByTenants,
} from './getTenantHoldingsAndLocations';

jest.mock('./extendKyWithTenant', () => ({
  extendKyWithTenant: jest.fn(),
}));

const holdingsRecords = [{
  id: 'holding-id',
  permanentLocationId: 'location-id',
}];

const locations = [{
  id: 'location-id',
  name: 'location-name',
}];

describe('utils', () => {
  let ky;

  beforeEach(() => {
    ky = {
      get: jest.fn((path) => {
        if (path === HOLDINGS_API) {
          return {
            json: jest.fn().mockResolvedValue({ holdingsRecords }),
          };
        }

        return ({
          json: jest.fn().mockResolvedValue({ locations }),
        });
      }),
    };
  });

  describe('getHoldingsAndLocations', () => {
    it('should return holdings, locations and locationIds', async () => {
      const searchParams = {};
      const signal = { signal: 'signal' };

      const result = await getHoldingsAndLocations({ ky, searchParams, signal });

      expect(result).toEqual({
        holdings: holdingsRecords,
        locations,
        locationIds: locations.map(({ id }) => id),
      });
    });

    it('should return holdings, locations and locationIds with tenantId', async () => {
      const searchParams = {};
      const signal = { signal: 'signal' };
      const tenantId = 'tenant-id';

      const result = await getHoldingsAndLocations({ ky, searchParams, signal, tenantId });

      expect(result).toEqual({
        holdings: holdingsRecords.map(holding => ({ ...holding, tenantId })),
        locations: locations.map(location => ({ ...location, tenantId })),
        locationIds: locations.map(({ id }) => id),
      });
    });
  });

  describe('getHoldingsAndLocationsByTenants', () => {
    beforeEach(() => {
      extendKyWithTenant.mockImplementation((tenantKy, tenantId) => {
        return { ...tenantKy, tenantId };
      });
    });

    it('should return locationsResponse', async () => {
      const instanceId = 'instance-id';
      const receivingTenantIds = ['tenant-id'];

      const result = await getHoldingsAndLocationsByTenants({ ky, instanceId, receivingTenantIds });

      expect(result).toEqual({
        holdings: holdingsRecords.map(holding => ({ ...holding, tenantId: receivingTenantIds[0] })),
        locations: locations.map(location => ({ ...location, tenantId: receivingTenantIds[0] })),
        locationIds: locations.map(({ id }) => id),
      });
    });

    it('should return empty array of holdings, locations and locationIds when `receivingTenantIds` and not present or empty array', async () => {
      const instanceId = 'instance-id';

      const result = await getHoldingsAndLocationsByTenants({
        ky,
        instanceId,
      });

      expect(result).toEqual({
        holdings: [],
        locations: [],
        locationIds: [],
      });
    });
  });
});
