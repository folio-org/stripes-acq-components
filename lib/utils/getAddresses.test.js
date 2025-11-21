import { getAddresses } from './getAddresses';

describe('getAddress', () => {
  it('should return parsed addresses', () => {
    const addresses = getAddresses([{
      id: 'id',
      value: { name: 'name', address: 'address' },
    }]);

    expect(addresses[0]).toEqual({ id: 'id', name: 'name', address: 'address' });
  });

  it('should return parsed addresses (legacy)', () => {
    const addresses = getAddresses([{ value: '{"name":"name", "address":"address"}', id: 'id' }]);

    expect(addresses[0]).toEqual({ id: 'id', name: 'name', address: 'address' });
  });

  it('should return empty address', () => {
    const addresses = getAddresses([{ id: 'id', value: '' }]);

    expect(addresses[0]).toEqual({ id: 'id', name: '', address: '' });
  });
});
