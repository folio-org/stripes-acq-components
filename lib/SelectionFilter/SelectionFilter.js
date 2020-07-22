import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  Selection,
} from '@folio/stripes/components';

import { FilterAccordion } from '../FilterAccordion';
import {
  filterSelectValues,
} from '../utils';
import { selectOptionsShape } from '../shapes';

const SelectionFilter = ({
  id,
  activeFilters,
  closedByDefault,
  disabled,
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
      {options && (
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
  id: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: selectOptionsShape,
};

SelectionFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default SelectionFilter;
