import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';

import { useFetchPrivilegedContacts } from './hooks';
import { PrivilegedDonorContactsList } from './PrivilegedDonorContactsList';

export const PrivilegedDonorsListContainer = ({ privilegedContactIds, ...rest }) => {
  const { contacts, isLoading } = useFetchPrivilegedContacts(privilegedContactIds);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PrivilegedDonorContactsList
      rowProps={{ alignLastColToEnd: false }}
      contentData={contacts}
      {...rest}
    />
  );
};

PrivilegedDonorsListContainer.propTypes = {
  privilegedContactIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
