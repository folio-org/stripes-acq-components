import { renderHook } from '@testing-library/react-hooks';

import { useReceivingTenantIdsAndLocations } from './useReceivingTenantIdsAndLocations';

jest.mock('../consortia', () => ({
  useCurrentUserTenants: jest.fn(() => [{ id: 'central' }, { id: 'college' }]),
}));

describe('useReceivingTenantIdsAndLocations', () => {
  it('should return receivingTenantIds', () => {
    const tenants = ['central', 'college'];
    const { result } = renderHook(() => useReceivingTenantIdsAndLocations({
      receivingTenantIds: tenants,
      currentReceivingTenantId: 'central',
    }));

    expect(result.current.receivingTenantIds).toEqual(tenants);
  });

  it('should return tenantId', () => {
    const currentReceivingTenantId = 'central';

    const { result } = renderHook(() => useReceivingTenantIdsAndLocations({ currentReceivingTenantId }));

    expect(result.current.tenantId).toBe(currentReceivingTenantId);
  });

  it('should return additionalLocationIds', () => {
    const { result } = renderHook(() => useReceivingTenantIdsAndLocations({}));

    expect(result.current.additionalLocationIds).toEqual([]);
  });
});
