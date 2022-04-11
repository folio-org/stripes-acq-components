export const getAddresses = (addresses = []) => {
  return addresses.map(address => {
    let value;

    try {
      value = JSON.parse(address.value);
    } catch (e) {
      value = {
        name: '',
        address: '',
      };
    }

    return {
      id: address.id,
      name: value.name,
      address: value.address,
    };
  });
};
