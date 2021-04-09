import { TIMEZONE } from '../constants';

export const formatDate = (value, intl, timeZone = TIMEZONE) => (
  value
    ? intl.formatDate(value, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone,
    })
    : null
);
