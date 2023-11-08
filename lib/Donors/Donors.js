import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { useState } from 'react';

import {
  Col,
  Loading,
  Row,
} from '@folio/stripes/components';

import { defaultColumnMapping } from './constants';
import DonorsContainer from './DonorsContainer';
import { useFetchDonors } from './hooks';

export function Donors({ name, donorOrganizationIds, ...rest }) {
  const [donorIds, setDonorIds] = useState(donorOrganizationIds);
  const { donors, isLoading } = useFetchDonors(donorIds);

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
          donors={donors}
          {...rest}
        />
      </Col>
    </Row>
  );
}

Donors.propTypes = {
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  donorOrganizationIds: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  searchLabel: PropTypes.node,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

Donors.defaultProps = {
  donorOrganizationIds: [],
  name: 'donorOrganizationIds',
  columnMapping: defaultColumnMapping,
};
