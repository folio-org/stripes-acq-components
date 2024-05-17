import get from 'lodash/get';
import identity from 'lodash/identity';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import {
  useForm,
  useFormState,
} from 'react-final-form';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import { FieldInventory } from '../../../FieldInventory';
import {
  useAffiliationsSelectionOptions,
  useCurrentUserTenants,
} from '../../../hooks/consortia';
import { FieldAffiliation } from '../FieldAffiliation';

export const ConsortiumFieldInventory = ({
  affiliationLabel,
  affiliationName = 'tenantId',
  disabled = false,
  filterLocations = identity,
  holdingName,
  labelless = false,
  locationName,
  locations,
  onAffiliationChange = noop,
  required = false,
  ...rest
}) => {
  const { batch, change } = useForm();
  const { values } = useFormState();
  const currUserTenants = useCurrentUserTenants();

  const affiliations = useMemo(() => {
    return currUserTenants?.map(({ id, name, isPrimary }) => ({
      tenantId: id,
      tenantName: name,
      isPrimary,
    }));
  }, [currUserTenants]);

  const { dataOptions } = useAffiliationsSelectionOptions(affiliations);

  const tenantId = get(values, affiliationName);

  const filterLocationsToSelect = useCallback((records, includeIds) => {
    if (!tenantId) return [];

    return filterLocations(
      records.filter((location) => location.tenantId === tenantId),
      includeIds,
    );
  }, [filterLocations, tenantId]);

  const changeSelectedAffiliation = useCallback((selectedTenantId) => {
    batch(() => {
      change(affiliationName, selectedTenantId);
      change(locationName, undefined);
      change(holdingName, undefined);
    });
    onAffiliationChange(selectedTenantId);
  }, [
    affiliationName,
    batch,
    change,
    holdingName,
    locationName,
    onAffiliationChange,
  ]);

  return (
    <Row>
      <Col xs>
        <FieldAffiliation
          affiliationLabel={affiliationLabel}
          dataOptions={dataOptions}
          labelless={labelless}
          name={affiliationName}
          onChange={changeSelectedAffiliation}
          required={required}
        />
      </Col>
      <Col xs>
        <FieldInventory
          disabled={disabled || !tenantId}
          filterLocations={filterLocationsToSelect}
          labelless={labelless}
          locations={locations}
          required={required}
          tenantId={tenantId}
          locationName={locationName}
          holdingName={holdingName}
          {...rest}
        />
      </Col>
    </Row>
  );
};

ConsortiumFieldInventory.propTypes = {
  affiliationLabel: PropTypes.node,
  affiliationName: PropTypes.string,
  disabled: PropTypes.bool,
  filterLocations: PropTypes.func,
  holdingName: PropTypes.string.isRequired,
  labelless: PropTypes.bool,
  locationName: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  onAffiliationChange: PropTypes.func,
  required: PropTypes.bool,
};
