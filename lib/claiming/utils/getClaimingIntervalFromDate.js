import { dayjs } from '@folio/stripes/components';

export const getClaimingIntervalFromDate = (date) => {
  const currentDay = dayjs().startOf('day');

  return dayjs(date).diff(currentDay, 'days');
};
