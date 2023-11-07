import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { useState } from 'react';

import {
  Col,
  Loading,
  Row,
} from '@folio/stripes/components';

import {
  defaultColumnMapping,
  defaultColumnWidths,
} from './constants';
import DonorsContainer from './DonorsContainer';
import { useFetchDonors } from './hooks';

function DonorsForm({ name, donorOrganizationIds, ...rest }) {
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

DonorsForm.propTypes = {
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  donorOrganizationIds: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  searchLabel: PropTypes.node,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsForm.defaultProps = {
  donorOrganizationIds: [],
  columnMapping: defaultColumnMapping,
  columnWidths: defaultColumnWidths,
};

export default DonorsForm;
