import moment from 'moment';
import identity from 'lodash/identity';
import * as queryUtils from './queryUtils';

import {
  DATE_RANGE_FILTER_FORMAT,
  SEARCH_PARAMETER,
} from '../constants';

describe('queryUtils', () => {
  describe('buildDateTimeRangeQuery', () => {
    const start = moment('2014-07-14').startOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);
    const end = moment('2020-07-14').endOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);

    it('should return query based on filter key and value', () => {
      expect(
        queryUtils.buildDateTimeRangeQuery('date', '2014-07-14:2020-07-14'),
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

  describe('buildFilterQuery', () => {
    const queryParams = {
      [SEARCH_PARAMETER]: String.raw`"he\\o wor\d"`,
      good: 'mood',
      bad: undefined,
    };

    it('should return search query with escaped quotes and backslashes', () => {
      expect(queryUtils.buildFilterQuery(queryParams, identity))
        .toEqual(String.raw`(\"he\\\\o wor\\d\") and good=="mood"`);
    });

    it('should return search query with raw value (without escaping)', () => {
      expect(queryUtils.buildFilterQuery(queryParams, identity, {}, false))
        .toEqual(String.raw`("he\\o wor\d") and good=="mood"`);
    });
  });

  describe('makeQueryBuilder', () => {
    const searchAllQuery = 'cql.allRecords=1';
    const defaultSorting = 'sortby name/sort.ascending';
    const queryParams = {
      [SEARCH_PARAMETER]: String.raw`"he\\o wor\d"`,
      good: 'mood',
      bad: undefined,
    };

    const buildQuery = queryUtils.makeQueryBuilder(
      searchAllQuery,
      identity,
      defaultSorting,
      {},
      {},
      false,
    );

    it('should return a function, which will build query string based on query parameters', () => {
      expect(buildQuery(queryParams))
        .toEqual(`${String.raw`(("he\\o wor\d") and good=="mood")`} ${defaultSorting}`);
    });
  });
});
