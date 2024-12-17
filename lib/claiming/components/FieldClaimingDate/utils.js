import { FormattedMessage } from 'react-intl';

import { dayjs } from '@folio/stripes/components';

const isSameOrBeforeDay = (day) => {
  const today = dayjs().startOf('day');

  return day.isSameOrBefore(today, 'day');
};

export const validateClaimingDate = (value) => {
  return isSameOrBeforeDay(dayjs(value))
    ? <FormattedMessage id="stripes-acq-components.validation.dateAfter" />
    : undefined;
};

export const excludePreviousDays = (day) => {
  return isSameOrBeforeDay(day);
};
