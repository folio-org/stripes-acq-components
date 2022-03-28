import React, { useState, useCallback, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  TextField,
} from '@folio/stripes/components';

import { FilterAccordion } from '../FilterAccordion';

const validationErrors = {
  cantBeNegative: 'cantBeNegative',
  maxCantBeLessMin: 'maxCantBeLessMin',
};

const NumberRangeFilter = ({
  name,
  onChange,
  id,
  activeFilters,
  closedByDefault = true,
  disabled = false,
  labelId,
}) => {
  const [filterValue, setFilterValue] = useState({});
  const [errors, setErrors] = useState({});

  const isNumberValid = (value) => (
    value === 0 || !!Number(value)
  );

  const onApply = useCallback((e) => {
    if (e) e.preventDefault();

    const isMinValid = isNumberValid(filterValue.min);
    const isMaxValid = isNumberValid(filterValue.max);

    if (
      (!isMinValid && !isMaxValid) ||
      Object.values(errors).filter(Boolean).length
    ) return undefined;

    if (isMaxValid && isMinValid && Number(filterValue.max) < Number(filterValue.min)) {
      return setErrors(prev => ({ ...prev, max: validationErrors.maxCantBeLessMin }));
    }

    return onChange({
      name,
      values: [`${filterValue.min}-${filterValue.max}`],
    });
  }, [errors, filterValue.max, filterValue.min, name, onChange]);

  const onInputChange = (value, field) => {
    setErrors(prev => {
      let max = errors.max;

      if (Object.values(errors).find(e => e === validationErrors.maxCantBeLessMin)) {
        max = '';
      }

      return { ...prev, max, [field]: '' };
    });

    const fieldValue = value ? Number(value) : '';

    if (fieldValue < 0) setErrors(prev => ({ ...prev, [field]: validationErrors.cantBeNegative }));

    setFilterValue(prev => ({ ...prev, [field]: fieldValue }));
  };

  const onClear = (field) => {
    setFilterValue(prev => ({ ...prev, [field]: '' }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  useEffect(() => {
    const [min = '', max = ''] = activeFilters?.[0]?.split('-') || [];

    setFilterValue({ min, max });
  }, [activeFilters]);

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
      <TextField
        label={<FormattedMessage id="stripes-acq-components.filter.numberRange.min" />}
        value={filterValue.min}
        type="number"
        disabled={disabled}
        error={errors.min ? <FormattedMessage id={`stripes-acq-components.validation.${errors.min}`} /> : null}
        onChange={(e) => onInputChange(e.target.value, 'min')}
        onClearField={() => onClear('min')}
      />
      <TextField
        label={<FormattedMessage id="stripes-acq-components.filter.numberRange.max" />}
        value={filterValue.max}
        type="number"
        disabled={disabled}
        error={errors.max ? <FormattedMessage id={`stripes-acq-components.validation.${errors.max}`} /> : null}
        onChange={(e) => onInputChange(e.target.value, 'max')}
        onClearField={() => onClear('max')}
      />
      <Button
        data-test-apply-button
        marginBottom0
        onClick={onApply}
        disabled={disabled}
      >
        <FormattedMessage id="stripes-acq-components.button.apply" />
      </Button>
    </FilterAccordion>
  );
};

NumberRangeFilter.propTypes = {
  name: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default NumberRangeFilter;
