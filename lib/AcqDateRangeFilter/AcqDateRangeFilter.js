import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DateRangeFilter } from '@folio/stripes/smart-components';
import { useLocaleDateFormat } from '@folio/stripes-acq-components';

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
  const stripesDateFormat = useLocaleDateFormat();
  const localeDateFormat = useMemo(
    () => dateFormat || stripesDateFormat,
    [stripesDateFormat, dateFormat],
  );

  const filterValue = activeFilters?.[0];
  const selectedValues = useMemo(() => {
    return retrieveDatesFromDateRangeFilterString(filterValue, localeDateFormat);
  }, [filterValue, localeDateFormat]);

  const makeDateRangeFilterString = useCallback((startDate, endDate) => {
    const startDateBackend = moment.utc(startDate, localeDateFormat).format(DATE_FORMAT);
    const endDateBackend = moment.utc(endDate, localeDateFormat).format(DATE_FORMAT);

    return `${startDateBackend}:${endDateBackend}`;
  }, [localeDateFormat]);

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
        dateFormat={localeDateFormat}
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
};

export default AcqDateRangeFilter;
