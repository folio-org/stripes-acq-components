import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import { defaultColumnMapping } from './constants';
import { DonorsContainer } from './DonorsContainer';
import { useFetchDonors } from './hooks';

const DEFAULT_DONOR_ORGANIZATION_IDS = [];

export function Donors({
  columnMapping = defaultColumnMapping,
  donorOrganizationIds = DEFAULT_DONOR_ORGANIZATION_IDS,
  name = 'donorOrganizationIds',
  onChange = noop,
  onRemove = noop,
  ...rest
}) {
  const [donorIds, setDonorIds] = useState(donorOrganizationIds);
  const { donors, isLoading } = useFetchDonors(donorIds, { keepPreviousData: true });

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
          columnMapping={columnMapping}
          component={DonorsContainer}
          donors={donors}
          id={name}
          loading={isLoading}
          name={name}
          onRemove={onRemove}
          setDonorIds={onSetDonorIds}
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
