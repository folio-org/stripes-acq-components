import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { DateRangeFilter } from '@folio/stripes/smart-components';

import { DATE_FORMAT } from '../constants';
import {
  createClearFilterHandler,
} from '../utils';

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
        ? endDate.subtract(1, 'days').format(DATE_FORMAT)
        : '',
    };
  }

  return dateRange;
};

const makeDateRangeFilterString = (startDate, endDate) => {
  const endDateCorrected = moment.utc(endDate).add(1, 'days').format(DATE_FORMAT);

  return `${startDate}:${endDateCorrected}`;
};

const AcqDateRangeFilter = ({
  activeFilters = [],
  closedByDefault = true,
  id,
  labelId,
  name,
  onChange,
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
      <DateRangeFilter
        name={name}
        selectedValues={retrieveDatesFromDateRangeFilterString(activeFilters[0])}
        onChange={onChange}
        makeFilterString={makeDateRangeFilterString}
        dateFormat={DATE_FORMAT}
      />
    </Accordion>
  );
};

AcqDateRangeFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  id: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AcqDateRangeFilter;
