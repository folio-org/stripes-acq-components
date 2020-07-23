import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CheckboxFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';

const AcqCheckboxFilter = ({
  activeFilters,
  closedByDefault,
  disabled,
  id,
  labelId,
  name,
  onChange,
  options,
}) => {
  const dataOptions = useMemo(() => options?.map(({ label, labelId: intlLabelId, ...restOption }) => ({
    ...restOption,
    disabled,
    label: intlLabelId ? <FormattedMessage id={intlLabelId} /> : label,
  })), [disabled, options]);

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
      {dataOptions && (
        <CheckboxFilter
          dataOptions={dataOptions}
          name={name}
          onChange={onChange}
          selectedValues={activeFilters}
        />
      )}
    </FilterAccordion>
  );
};

AcqCheckboxFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    label: PropTypes.node,
    readOnly: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
};

AcqCheckboxFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default AcqCheckboxFilter;
