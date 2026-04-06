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

import { EVENT_EMITTER_EVENTS } from '../constants';
import {
  useAffiliationsSelectionOptions,
  useConsortiumTenants,
  useCurrentUserTenants,
  useEventEmitter,
} from '../hooks';
import { FieldInventory } from '../FieldInventory';
import { FieldAffiliation } from '../FieldAffiliation';

import css from './ConsortiumFieldInventory.css';

export const ConsortiumFieldInventory = ({
  // Additional affiliations to be displayed in the dropdown if the current user is not affiliated with them which is defined by UIOR-1311
  additionalAffiliationIds = [],
  affiliationLabel,
  affiliationName,
  disabled = false,
  filterLocations = identity,
  holdingName,
  isNonInteractive = false,
  labelless = false,
  locationName,
  locations,
  onAffiliationChange = noop,
  required = false,
  vertical = false,
  ...rest
}) => {
  const { batch, change } = useForm();
  const { values } = useFormState();
  const currUserTenants = useCurrentUserTenants();
  const { tenants } = useConsortiumTenants();
  const eventEmitter = useEventEmitter();

  const affiliations = useMemo(() => {
    let tenantList = currUserTenants;
    const isAdditionalAffiliationsMissing = additionalAffiliationIds.some((id) => {
      return !currUserTenants?.find(({ id: tenantId }) => tenantId === id);
    });

    if (additionalAffiliationIds.length && isAdditionalAffiliationsMissing) {
      const additionalAffiliations = tenants?.filter(({ id }) => additionalAffiliationIds.includes(id));

      tenantList = [...additionalAffiliations, ...currUserTenants];
    }

    return tenantList?.map(({ id, name, isPrimary }) => ({
      tenantId: id,
      tenantName: name,
      isPrimary,
    }));
  }, [additionalAffiliationIds, currUserTenants, tenants]);

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
    // Emit event to reset FieldInventory when affiliation is changed
    // This is needed to reset FieldInventory when the same affiliation is selected again.
    // Should be triggered before form change to have access to previous tenantId in event listener
    // which is needed to decide whether to reset FieldInventory or not.
    eventEmitter.emit(
      EVENT_EMITTER_EVENTS.FIELD_INVENTORY_AFFILIATION_CHANGED,
      {
        locationName,
        holdingName,
        tenantId: selectedTenantId,
      },
    );
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
    eventEmitter,
    holdingName,
    locationName,
    onAffiliationChange,
  ]);

  return (
    <Row className={vertical && css.vertical}>
      <Col xs>
        <FieldAffiliation
          affiliationLabel={affiliationLabel}
          dataOptions={dataOptions}
          isNonInteractive={isNonInteractive}
          labelless={labelless}
          name={affiliationName}
          onChange={changeSelectedAffiliation}
          required={required}
        />
      </Col>
      <Col xs>
        <FieldInventory
          disabled={disabled || !tenantId}
          isNonInteractive={isNonInteractive}
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
  additionalAffiliationIds: PropTypes.arrayOf(PropTypes.string),
  affiliationLabel: PropTypes.node,
  affiliationName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  filterLocations: PropTypes.func,
  holdingName: PropTypes.string.isRequired,
  isNonInteractive: PropTypes.bool,
  isLoading: PropTypes.bool,
  labelless: PropTypes.bool,
  locationName: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    institutionId: PropTypes.string.isRequired,
    campusId: PropTypes.string.isRequired,
    libraryId: PropTypes.string.isRequired,
    tenantId: PropTypes.string,
  })),
  onAffiliationChange: PropTypes.func,
  required: PropTypes.bool,
  vertical: PropTypes.bool,
};
