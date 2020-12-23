import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DateRangeFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';
import { DATE_FORMAT } from '../constants';

const retrieveDatesFromDateRangeFilterString = (filterValue, dateFormat) => {
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
        ? startDate.format(dateFormat)
        : '',
      endDate: endDate.isValid()
        ? endDate.format(dateFormat)
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
  dateFormat,
}) => {
  const filterValue = activeFilters?.[0];
  const selectedValues = useMemo(() => {
    return retrieveDatesFromDateRangeFilterString(filterValue, dateFormat);
  }, [filterValue, dateFormat]);

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
        dateFormat={dateFormat}
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
  dateFormat: PropTypes.string,
};

AcqDateRangeFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
  dateFormat: DATE_FORMAT,
};

export default AcqDateRangeFilter;
