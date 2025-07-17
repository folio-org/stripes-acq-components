import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import omit from 'lodash/omit';
import noop from 'lodash/noop';

import { DateRangeFilter } from '@folio/stripes/smart-components';
import { nativeChangeFieldValue } from '@folio/stripes/components';

import { useLocaleDateFormat } from '../hooks';
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
  closedByDefault = true,
  disabled = false,
  id,
  label,
  labelId,
  name,
  onChange,
  dateFormat,
  subscribeOnReset = noop,
  ...rest
}) => {
  const stripesDateFormat = useLocaleDateFormat();
  const localeDateFormat = useMemo(
    () => dateFormat || stripesDateFormat,
    [stripesDateFormat, dateFormat],
  );
  const startDateInputRef = useRef();
  const endDateInputRef = useRef();

  const filterValue = activeFilters?.[0];
  const selectedValues = useMemo(() => {
    return retrieveDatesFromDateRangeFilterString(filterValue, localeDateFormat);
  }, [filterValue, localeDateFormat]);

  const makeDateRangeFilterString = useCallback((startDate, endDate) => {
    const startDateBackend = moment.utc(startDate, localeDateFormat).format(DATE_FORMAT);
    const endDateBackend = moment.utc(endDate, localeDateFormat).format(DATE_FORMAT);

    return `${startDateBackend}:${endDateBackend}`;
  }, [localeDateFormat]);

  const onSearchReset = useCallback(() => {
    // use setTimeout to avoid event conflicts that prevent some fields from being cleared.
    setTimeout(() => {
      if (startDateInputRef.current?.value) {
        nativeChangeFieldValue(startDateInputRef, false, '');
      }

      if (endDateInputRef.current?.value) {
        nativeChangeFieldValue(endDateInputRef, false, '');
      }
    });
  }, []);

  useEffect(() => {
    subscribeOnReset(onSearchReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        endDateInputRef={endDateInputRef}
        focusRef={startDateInputRef}
        {...rest}
      />
    </FilterAccordion>
  );
};

AcqDateRangeFilter.propTypes = {
  ...omit(DateRangeFilter.propTypes, 'selectedValues', 'makeFilterString'),
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  labelId: PropTypes.string,
  subscribeOnReset: PropTypes.func,
};

export default AcqDateRangeFilter;
