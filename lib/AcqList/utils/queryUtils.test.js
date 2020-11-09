import moment from 'moment';
import * as queryUtils from './queryUtils';

import { DATE_RANGE_FILTER_FORMAT } from '../constants';

describe('queryUtils', () => {
  describe('buildDateTimeRangeQuery', () => {
    it('should return query based on filter key and value', () => {
      expect(
        queryUtils.buildDateTimeRangeQuery('date', '2014-07-14:2014-07-14'),
      ).toEqual('(date>="2014-07-14T00:00:00.000" and date<="2014-07-14T23:59:59.999")');
    });
  });

  describe('buildDateRangeQuery', () => {
    const start = moment('2014-07-14').startOf('day').format(DATE_RANGE_FILTER_FORMAT);
    const end = moment('2014-07-14').endOf('day').format(DATE_RANGE_FILTER_FORMAT);

    it('should return query based on filter key and value', () => {
      expect(
        queryUtils.buildDateRangeQuery('date', '2014-07-14:2014-07-14'),
      ).toEqual(`(date>="${start}" and date<="${end}")`);
    });
  });
});
