import { map, sortBy } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { MultiSelection } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import {
  DonorsLookup,
  useFetchDonors,
} from '../Donors';
import { FilterAccordion } from '../FilterAccordion';
import { organizationByPropManifest } from '../manifests';

const PluggableDonorFilter = ({
  id,
  activeFilters,
  closedByDefault,
  disabled,
  labelId,
  name,
  onChange,
}) => {
  const { donors } = useFetchDonors(activeFilters);
  const [selectedDonors, setSelectedDonors] = useState([]);

  useEffect(() => {
    if (activeFilters?.length && !selectedDonors?.length) {
      setSelectedDonors(donors);
    }
  }, [activeFilters, donors, selectedDonors]);

  const onSelectDonor = useCallback((values) => {
    setSelectedDonors(donors);
    onChange({
      name,
      values: map(values, 'id'),
    });
  }, [donors, name, onChange]);

  const onRemove = useCallback((donor) => {
    const updatedDonorIds = selectedDonors.filter(({ id: donorId }) => donorId !== donor.value);

    setSelectedDonors(updatedDonorIds);
    onChange({
      name,
      values: map(updatedDonorIds, 'id'),
    });
  }, [name, onChange, selectedDonors]);

  const intl = useIntl();
  const label = intl.formatMessage({ id: labelId });
  const dataOptions = useMemo(() => {
    return selectedDonors.map(donor => ({ value: donor.id, label: donor.name }));
  }, [selectedDonors]);

  const onClearAll = () => {
    onChange({
      name,
      values: [],
    });
    setSelectedDonors([]);
  };

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      labelId={labelId}
      name={name}
      onChange={onClearAll}
    >
      <MultiSelection
        id="input-tag"
        aria-label={label}
        disabled
        dataOptions={sortBy(dataOptions, ['value'])}
        value={sortBy(dataOptions, ['value'])}
        onRemove={onRemove}
      />
      <DonorsLookup
        searchButtonStyle="link"
        onAddDonors={onSelectDonor}
        searchLabel={<FormattedMessage id="stripes-acq-components.filter.donor.lookup" />}
      />
    </FilterAccordion>
  );
};

PluggableDonorFilter.manifest = {
  filterOrganization: {
    ...organizationByPropManifest,
    accumulate: true,
    fetch: false,
  },
};

PluggableDonorFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

PluggableDonorFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default stripesConnect(PluggableDonorFilter);
