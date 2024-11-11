import sortBy from 'lodash/sortBy';

export const getAddressOptions = (addresses = []) => sortBy(
  addresses.map(address => ({
    value: address.id,
    label: address.name,
  })), 'label',
);
