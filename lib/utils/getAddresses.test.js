import { getAddresses } from './getAddresses';

describe('getAddress', () => {
  it('should return parsed addresses', () => {
    const addresses = getAddresses([{ value: '{"name":"name", "address":"address"}', id: 'id' }]);

    expect(addresses[0]).toEqual({ id: 'id', name: 'name', address: 'address' });
  });

  it('should return empty address', () => {
    const addresses = getAddresses([{ id: 'id' }]);

    expect(addresses[0]).toEqual({ id: 'id', name: '', address: '' });
  });
});
