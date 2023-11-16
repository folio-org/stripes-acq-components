import { noop } from 'lodash';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { useEffect, useState } from 'react';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import { defaultColumnMapping } from './constants';
import { DonorsContainer } from './DonorsContainer';
import { useFetchDonors } from './hooks';

export function Donors({ name, donorOrganizationIds, onChange, ...rest }) {
  const [donorIds, setDonorIds] = useState(donorOrganizationIds);
  const { donors, isLoading } = useFetchDonors(donorIds);

  useEffect(() => {
    setDonorIds(donorOrganizationIds);
  }, [donorOrganizationIds]);

  const onSetDonorIds = (values = []) => {
    setDonorIds(values);
    onChange(values);
  };

  return (
    <Row>
      <Col xs={12}>
        <FieldArray
          name={name}
          id={name}
          component={DonorsContainer}
          setDonorIds={onSetDonorIds}
          donors={donors}
          loading={isLoading}
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
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  searchLabel: PropTypes.node,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

Donors.defaultProps = {
  columnMapping: defaultColumnMapping,
  donorOrganizationIds: [],
  name: 'donorOrganizationIds',
  onChange: noop,
  onRemove: noop,
};
