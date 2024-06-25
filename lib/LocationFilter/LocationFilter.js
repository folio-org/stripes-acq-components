import map from 'lodash/map';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import { MultiSelection } from '@folio/stripes/components';

import { FilterAccordion } from '../FilterAccordion';
import { FindLocation } from '../FindLocation';

const LocationFilter = ({
  id,
  isLoading = false,
  name,
  closedByDefault = true,
  crossTenant = false,
  activeFilter,
  labelId,
  locations = [],
  onChange,
  disabled = false,
}) => {
  const intl = useIntl();

  const dataOptions = useMemo(() => {
    return locations.map((location) => ({
      value: location.id,
      label: location.name,
    }));
  }, [locations]);

  const value = useMemo(() => {
    return activeFilter?.map((locationId) => {
      const locationOption = dataOptions.find((option) => option.value === locationId);

      return {
        value: locationOption?.value || locationId,
        label: locationOption?.label || intl.formatMessage({ id: 'stripes-acq-components.invalidReference' }),
      };
    });
  }, [activeFilter, dataOptions, intl]);

  const selectLocation = useCallback((selectedLocations) => {
    const filterValues = [...new Set([...map(value, 'value'), ...map(selectedLocations, 'id')])];

    onChange({ name, values: filterValues });
  }, [name, onChange, value]);

  const onRemove = useCallback((deletedOption) => {
    const filterValues = value
      ?.filter((option) => deletedOption.value !== option.value)
      ?.map(((option) => option.value));

    onChange({ name, values: filterValues });
  }, [name, onChange, value]);

  return (
    <FilterAccordion
      activeFilters={activeFilter}
      id={id}
      closedByDefault={closedByDefault}
      disabled={disabled}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <MultiSelection
        ariaLabelledBy={`accordion-toggle-button-${id}`}
        id={id}
        disabled
        dataOptions={dataOptions}
        value={value}
        onRemove={onRemove}
      />
      <FindLocation
        id="fund-locations"
        isMultiSelect
        onRecordsSelect={selectLocation}
        searchButtonStyle="link"
        crossTenant={crossTenant}
        disabled={disabled || isLoading}
      />
    </FilterAccordion>
  );
};

LocationFilter.propTypes = {
  activeFilter: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  crossTenant: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LocationFilter;
