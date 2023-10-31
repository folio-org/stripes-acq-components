import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Loading,
  Row,
} from '@folio/stripes/components';

import DonorsList from './DonorsList';
import { useFetchDonors } from './hooks';

function DonorsContainer({ name, donorOrganizationIds }) {
  const [donors, setDonors] = useState([]);
  const { fetchDonorsMutation, isLoading } = useFetchDonors();

  const handleFetchDonors = useCallback(ids => {
    fetchDonorsMutation({ donorOrganizationIds: ids })
      .then((data) => {
        setDonors(data);
      });
  }, [fetchDonorsMutation]);

  useEffect(() => {
    if (donorOrganizationIds.length) {
      handleFetchDonors(donorOrganizationIds);
    }
  }, [donorOrganizationIds, handleFetchDonors]);

  const donorsMap = donors.reduce((acc, contact) => {
    acc[contact.id] = contact;

    return acc;
  }, {});

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Row>
      <Col xs={12}>
        <FieldArray
          name={name}
          id={name}
          component={DonorsList}
          fetchDonors={handleFetchDonors}
          donorsMap={donorsMap}
        />
      </Col>
    </Row>
  );
}

DonorsContainer.propTypes = {
  name: PropTypes.string.isRequired,
  donorOrganizationIds: PropTypes.arrayOf(PropTypes.string),
};

DonorsContainer.defaultProps = {
  donorOrganizationIds: [],
};

export default DonorsContainer;
