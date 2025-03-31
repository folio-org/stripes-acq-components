import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';

import { Select } from '@folio/stripes/components';

import { FilterAccordion } from '../FilterAccordion';
import { selectOptionsShape } from '../shapes';

const SelectFilter = ({
  id,
  activeFilters,
  closedByDefault = true,
  disabled = false,
  labelId,
  name,
  onChange,
  options,
}) => {
  const changeSelectFilter = useCallback(({
    target: { value },
  }) => {
    onChange({
      name,
      values: value && [value],
    });
  }, [name, onChange]);

  const dataOptions = useMemo(() => [{ label: '', value: undefined }].concat(options), [options]);

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
        <Select
          aria-labelledby={`accordion-toggle-button-${id}`}
          dataOptions={dataOptions}
          disabled={disabled}
          id={`${name}-select`}
          onChange={changeSelectFilter}
          value={activeFilters?.[0] || ''}
        />
      )}
    </FilterAccordion>
  );
};

SelectFilter.propTypes = {
  id: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: selectOptionsShape,
};

export default SelectFilter;
