import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Loading,
  Row,
} from '@folio/stripes/components';

import DonorsContainer from './DonorsContainer';
import { useFetchDonors } from './hooks';

function DonorsForm({ name, donorOrganizationIds, ...rest }) {
  const [donorIds, setDonorIds] = useState(donorOrganizationIds);
  const { donors, isLoading } = useFetchDonors(donorIds);

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
          component={DonorsContainer}
          setDonorIds={setDonorIds}
          donorsMap={donorsMap}
          {...rest}
        />
      </Col>
    </Row>
  );
}

DonorsForm.propTypes = {
  donorOrganizationIds: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  searchLabel: PropTypes.node,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsForm.defaultProps = {
  donorOrganizationIds: [],
};

export default DonorsForm;
