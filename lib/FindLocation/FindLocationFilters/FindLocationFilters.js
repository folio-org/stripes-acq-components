import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';

import { AccordionSet } from '@folio/stripes/components';

import { AcqCheckboxFilter } from '../../AcqCheckboxFilter';
import { FILTERS } from '../configs';
import { LibrariesFilter } from './LibrariesFilter';
import { InstitutionsFilter } from './InstitutionsFilter';
import { CampusesFilter } from './CampusesFilter';

export const FindLocationFilters = ({
  activeFilters,
  applyFilters,
  disabled,
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

      <LibrariesFilter
        id={FILTERS.libraries}
        activeFilters={activeFilters[FILTERS.libraries]}
        name={FILTERS.libraries}
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

      {/* <AcqCheckboxFilter
      /> */}
    </AccordionSet>
  );
}

FindLocationFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
