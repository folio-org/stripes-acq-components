import get from 'lodash/get';
import PropTypes from 'prop-types';

import { getFullName } from '@folio/stripes/util';

export const RoutingListUserItem = (user) => {
  const { id, personal } = user;
  const address = get(personal, 'addresses[0].addressLine1', '');

  return (
    <li key={id}>
      {getFullName(user) + (address ? ` - ${address}` : '')}
    </li>
  );
};

RoutingListUserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    personal: PropTypes.shape({
      addresses: PropTypes.arrayOf(PropTypes.shape({
        addressLine1: PropTypes.string,
      })),
    }),
  }).isRequired,
};
