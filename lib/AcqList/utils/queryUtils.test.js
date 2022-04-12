import moment from 'moment';
import * as queryUtils from './queryUtils';

import { DATE_RANGE_FILTER_FORMAT } from '../constants';
import { TIMEZONE } from '../../constants';

describe('queryUtils', () => {
  describe('buildDateTimeRangeQuery', () => {
    const dateRange = '2014-07-14:2020-07-14';
    const [from, to] = dateRange.split(':');
    const start = moment.tz(from, TIMEZONE).startOf('day').format();
    const end = moment.tz(to, TIMEZONE).endOf('day').format();

    it('should return query based on filter key and value', () => {
      expect(
        queryUtils.buildDateTimeRangeQuery(['date', TIMEZONE], dateRange),
      ).toEqual(`(date>="${start}" and date<="${end}")`);
    });
  });

  describe('buildDateRangeQuery', () => {
    const start = moment('2014-07-14').startOf('day').format(DATE_RANGE_FILTER_FORMAT);
    const end = moment('2020-07-14').endOf('day').format(DATE_RANGE_FILTER_FORMAT);

    it('should return query based on filter key and value', () => {
      expect(
        queryUtils.buildDateRangeQuery('date', '2014-07-14:2020-07-14'),
      ).toEqual(`(date>="${start}" and date<="${end}")`);
    });
  });

  describe('buildNumberRangeQuery', () => {
    it('should return query based on filter key and value', () => {
      expect(
        queryUtils.buildNumberRangeQuery('amount', '10-100'),
      ).toEqual('(amount >=/number 10 and amount <=/number 100)');
    });
  });
});
