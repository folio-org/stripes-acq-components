import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';

import { DonorsList } from './DonorsList';
import { useFetchDonors } from './hooks';

export const DonorsListContainer = ({ donorOrganizationIds, ...rest }) => {
  const { donors, isLoading } = useFetchDonors(donorOrganizationIds);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DonorsList
      rowProps={{ alignLastColToEnd: false }}
      contentData={donors}
      {...rest}
    />
  );
};

DonorsListContainer.propTypes = {
  donorOrganizationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
