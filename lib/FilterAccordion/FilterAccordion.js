import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

const FilterAccordion = ({
  activeFilters,
  children,
  closedByDefault,
  disabled,
  id,
  label,
  labelId,
  name,
  onChange,
}) => {
  const onClearFilter = useCallback(() => {
    onChange({ name, values: [] });
  }, [name, onChange]);

  return (
    <Accordion
      closedByDefault={closedByDefault}
      displayClearButton={!disabled && activeFilters?.length > 0}
      header={FilterAccordionHeader}
      id={id || name}
      label={labelId ? <FormattedMessage id={labelId} /> : label}
      onClearFilter={onClearFilter}
    >
      {children}
    </Accordion>
  );
};

FilterAccordion.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

FilterAccordion.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default FilterAccordion;
