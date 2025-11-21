import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import { FilterAccordion } from '../FilterAccordion';

export const TextFilter = ({
  id,
  activeFilters,
  closedByDefault = true,
  labelId,
  name,
  onChange,
  ...rest
}) => {
  const debouncedOnChange = useMemo(() => debounce(onChange, 250), [onChange]);

  const changeFilter = useCallback((e) => {
    const value = e.target.value;

    return value
      ? debouncedOnChange({ name, values: [value] })
      : debouncedOnChange({ name, values: [] });
  }, [name, debouncedOnChange]);

  const intl = useIntl();
  const label = intl.formatMessage({ id: labelId });

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      id={id}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <TextField
        ariaLabel={label}
        value={activeFilters?.[0] || ''}
        onChange={changeFilter}
        {...rest}
      />
    </FilterAccordion>
  );
};

TextFilter.propTypes = {
  ...TextField.propTypes,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
