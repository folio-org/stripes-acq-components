import { dayjs } from '@folio/stripes/components';

import { getClaimingIntervalFromDate } from './getClaimingIntervalFromDate';

describe('getClaimingIntervalFromDate', () => {
  it('should return claiming interval calculated based on provided date', () => {
    const today = dayjs().startOf('day');

    expect(getClaimingIntervalFromDate(today)).toEqual(0);
    expect(getClaimingIntervalFromDate(today.add(5, 'days'))).toEqual(5);
  });
});
