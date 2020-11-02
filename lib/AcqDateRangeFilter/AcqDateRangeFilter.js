import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DateRangeFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';
import { DATE_FORMAT } from '../constants';

const retrieveDatesFromDateRangeFilterString = filterValue => {
  let dateRange = {
    startDate: '',
    endDate: '',
  };

  if (filterValue) {
    const [startDateString, endDateString] = filterValue.split(':');
    const endDate = moment.utc(endDateString);
    const startDate = moment.utc(startDateString);

    dateRange = {
      startDate: startDate.isValid()
        ? startDate.format(DATE_FORMAT)
        : '',
      endDate: endDate.isValid()
        ? endDate.format(DATE_FORMAT)
        : '',
    };
  }

  return dateRange;
};

const makeDateRangeFilterString = (startDate, endDate) => {
  return `${startDate}:${endDate}`;
};

const AcqDateRangeFilter = ({
  activeFilters,
  closedByDefault,
  disabled,
  id,
  label,
  labelId,
  name,
  onChange,
}) => {
  const filterValue = activeFilters?.[0];
  const selectedValues = useMemo(() => retrieveDatesFromDateRangeFilterString(filterValue), [filterValue]);

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      label={label}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <DateRangeFilter
        name={name}
        selectedValues={selectedValues}
        onChange={onChange}
        makeFilterString={makeDateRangeFilterString}
        dateFormat={DATE_FORMAT}
      />
    </FilterAccordion>
  );
};

AcqDateRangeFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

AcqDateRangeFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default AcqDateRangeFilter;
