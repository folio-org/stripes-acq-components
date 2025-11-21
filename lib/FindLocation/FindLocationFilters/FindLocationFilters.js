import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';

import { AccordionSet } from '@folio/stripes/components';

import { AcqCheckboxFilter } from '../../AcqCheckboxFilter';
import {
  ASSIGNED_FILTER_OPTIONS,
  FILTERS,
} from '../configs';
import { CampusesFilter } from './CampusesFilter';
import { InstitutionsFilter } from './InstitutionsFilter';
import { LibrariesFilter } from './LibrariesFilter';

const getSelectionFilterOptions = ({ id, name, code }) => ({
  label: [name, code && `(${code})`].join(' '),
  value: id,
});

const DEFAULT_CAMPUSES = [];
const DEFAULT_INSTITUTIONS = [];
const DEFAULT_LIBRARIES = [];

export const FindLocationFilters = ({
  activeFilters,
  applyFilters,
  campuses = DEFAULT_CAMPUSES,
  disabled,
  institutions = DEFAULT_INSTITUTIONS,
  isMultiSelect,
  libraries = DEFAULT_LIBRARIES,
}) => {
  const adaptedApplyFilters = useCallback(({ name, values }) => applyFilters(name, values), [applyFilters]);

  const institutionOptions = useMemo(() => institutions.map(getSelectionFilterOptions), [institutions]);
  const campusesOptions = useMemo(() => campuses.map(getSelectionFilterOptions), [campuses]);
  const librariesOptions = useMemo(() => libraries.map(getSelectionFilterOptions), [libraries]);

  return (
    <AccordionSet>
      <InstitutionsFilter
        id={FILTERS.institutions}
        activeFilters={activeFilters[FILTERS.institutions]}
        name={FILTERS.institutions}
        onChange={adaptedApplyFilters}
        disabled={disabled}
        options={institutionOptions}
      />

      <CampusesFilter
        id={FILTERS.campuses}
        activeFilters={activeFilters[FILTERS.campuses]}
        name={FILTERS.campuses}
        onChange={adaptedApplyFilters}
        disabled={disabled}
        options={campusesOptions}
      />

      <LibrariesFilter
        id={FILTERS.libraries}
        activeFilters={activeFilters[FILTERS.libraries]}
        name={FILTERS.libraries}
        onChange={adaptedApplyFilters}
        disabled={disabled}
        options={librariesOptions}
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
};

FindLocationFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  campuses: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
  })),
  disabled: PropTypes.bool,
  institutions: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
  })),
  isMultiSelect: PropTypes.bool,
  libraries: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
  })),
};
