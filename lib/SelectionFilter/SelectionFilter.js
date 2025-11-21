import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { Selection } from '@folio/stripes/components';

import { FilterAccordion } from '../FilterAccordion';
import { selectOptionsShape } from '../shapes';
import { filterSelectValues } from '../utils';

const SelectionFilter = ({
  activeFilters,
  closedByDefault = true,
  disabled = false,
  id,
  labelId,
  name,
  onChange,
  options,
}) => {
  const changeSelectionFilter = useCallback(
    value => onChange({ name, values: [value] }),
    [name, onChange],
  );

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      {!options ? '' : (
        <Selection
          aria-labelledby={`accordion-toggle-button-${id}`}
          dataOptions={options}
          disabled={disabled}
          id={`${name}-selection`}
          onChange={changeSelectionFilter}
          onFilter={filterSelectValues}
          value={activeFilters?.[0] || ''}
        />
      )}
    </FilterAccordion>
  );
};

SelectionFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: selectOptionsShape,
};

export default SelectionFilter;
