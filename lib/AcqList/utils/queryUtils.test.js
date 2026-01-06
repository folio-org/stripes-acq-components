import identity from 'lodash/identity';

import { dayjs } from '@folio/stripes/components';

import { NO_DST_TIMEZONES } from 'fixtures';
import { SEARCH_PARAMETER } from '../constants';
import * as queryUtils from './queryUtils';

const dateTimeConfig = {
  from: '2014-07-14',
  to: '2020-07-14',
};

describe('queryUtils', () => {
  describe('buildDateTimeRangeQuery', () => {
    const expectedResultsDict = {
      [NO_DST_TIMEZONES.AFRICA_DAKAR]: {
        start: '2014-07-14T00:00:00.000',
        end: '2020-07-14T23:59:59.999',
      },
      [NO_DST_TIMEZONES.AMERICA_BOGOTA]: {
        start: '2014-07-14T05:00:00.000',
        end: '2020-07-15T04:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_DUBAI]: {
        start: '2014-07-13T20:00:00.000',
        end: '2020-07-14T19:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_SHANGHAI]: {
        start: '2014-07-13T16:00:00.000',
        end: '2020-07-14T15:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_TOKIO]: {
        start: '2014-07-13T15:00:00.000',
        end: '2020-07-14T14:59:59.999',
      },
      [NO_DST_TIMEZONES.EUROPE_MOSCOW]: {
        start: '2014-07-13T20:00:00.000',
        end: '2020-07-14T20:59:59.999',
      },
      [NO_DST_TIMEZONES.PACIFIC_TAHITI]: {
        start: '2014-07-14T10:00:00.000',
        end: '2020-07-15T09:59:59.999',
      },
      [NO_DST_TIMEZONES.UTC]: {
        start: '2014-07-14T00:00:00.000',
        end: '2020-07-14T23:59:59.999',
      },
    };

    describe('Global default timezone', () => {
      it.each(Object.keys(expectedResultsDict))('should return query based on filter key and value - timezone: %s', (timezone) => {
        const { start, end } = expectedResultsDict[timezone];

        dayjs.tz.setDefault(timezone);

        const result = queryUtils.buildDateTimeRangeQuery('date', `${dateTimeConfig.from}:${dateTimeConfig.to}`);

        dayjs.tz.setDefault();

        expect(result).toEqual(`(date>="${start}" and date<="${end}")`);
      });
    });

    describe('Provided timezone in options', () => {
      it.each(Object.keys(expectedResultsDict))('should return query based on filter key and value - timezone: %s', (timezone) => {
        const { start, end } = expectedResultsDict[timezone];

        const result = queryUtils.buildDateTimeRangeQuery(
          'date',
          `${dateTimeConfig.from}:${dateTimeConfig.to}`,
          { timezone },
        );

        expect(result).toEqual(`(date>="${start}" and date<="${end}")`);
      });
    });
  });

  describe('buildDateRangeQuery', () => {
    it.each(Object.values(NO_DST_TIMEZONES))('should return query based on filter key and value - timezone: %s', (timezone) => {
      dayjs.tz.setDefault(timezone);

      const result = queryUtils.buildDateRangeQuery('date', `${dateTimeConfig.from}:${dateTimeConfig.to}`);

      dayjs.tz.setDefault();

      expect(result).toEqual(`(date>="${dateTimeConfig.from}T00:00:00.000" and date<="${dateTimeConfig.to}T23:59:59.999")`);
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
