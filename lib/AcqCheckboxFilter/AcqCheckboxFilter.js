import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import {
  createClearFilterHandler,
} from '../utils';

const AcqCheckboxFilter = ({
  activeFilters = [],
  closedByDefault = true,
  id,
  labelId,
  name,
  onChange,
  options = [],
}) => {
  return (
    <Accordion
      closedByDefault={closedByDefault}
      displayClearButton={activeFilters.length > 0}
      header={FilterAccordionHeader}
      id={id}
      label={<FormattedMessage id={labelId} />}
      onClearFilter={createClearFilterHandler(onChange, name)}
    >
      <CheckboxFilter
        dataOptions={options}
        name={name}
        onChange={onChange}
        selectedValues={activeFilters}
      />
    </Accordion>
  );
};

AcqCheckboxFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
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

export default AcqCheckboxFilter;
