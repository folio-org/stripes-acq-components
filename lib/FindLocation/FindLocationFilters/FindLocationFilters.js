import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { AccordionSet } from '@folio/stripes/components';

import { AcqCheckboxFilter } from '../../AcqCheckboxFilter';
import {
  ASSIGNED_FILTER_OPTIONS,
  FILTERS,
} from '../configs';
import { CampusesFilter } from './CampusesFilter';
import { InstitutionsFilter } from './InstitutionsFilter';
import { LibrariesFilter } from './LibrariesFilter';

export const FindLocationFilters = ({
  activeFilters,
  applyFilters,
  disabled,
  isMultiSelect,
}) => {
  const adaptedApplyFilters = useCallback(({ name, values }) => applyFilters(name, values), [applyFilters]);

  return (
    <AccordionSet>
      <InstitutionsFilter
        id={FILTERS.institutions}
        activeFilters={activeFilters[FILTERS.institutions]}
        name={FILTERS.institutions}
        onChange={adaptedApplyFilters}
        disabled={disabled}
        options={[]}
      />

      <CampusesFilter
        id={FILTERS.campuses}
        activeFilters={activeFilters[FILTERS.campuses]}
        name={FILTERS.campuses}
        onChange={adaptedApplyFilters}
        disabled={disabled}
        options={[]}
      />

      <LibrariesFilter
        id={FILTERS.libraries}
        activeFilters={activeFilters[FILTERS.libraries]}
        name={FILTERS.libraries}
        onChange={adaptedApplyFilters}
        disabled={disabled}
        options={[]}
      />

      {isMultiSelect && (
        <AcqCheckboxFilter
          closedByDefault={false}
          id={FILTERS.isAssigned}
          activeFilters={activeFilters[FILTERS.isAssigned]}
          labelId="stripes-acq-components.find-location.results.column.assignment"
          name={FILTERS.isAssigned}
          onChange={adaptedApplyFilters}
          disabled={disabled}
          options={ASSIGNED_FILTER_OPTIONS}
        />
      )}
    </AccordionSet>
  );
}

FindLocationFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
};
