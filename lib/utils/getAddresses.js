/**
 * @deprecated
 *
 * TODO: remove file in the next major release (8.x.x)
 */
export const getAddresses = (addresses = []) => {
  return addresses.map(address => {
    let value;

    try {
      value = (typeof address.value === 'string') ? JSON.parse(address.value) : address.value;
    } catch (e) {
      value = {
        address: '',
        name: '',
      };
    }

    return {
      address: value?.address ?? '',
      id: address.id,
      key: address.key,
      metadata: address.metadata,
      name: value?.name ?? '',
      scope: address.scope,
    };
  });
};
