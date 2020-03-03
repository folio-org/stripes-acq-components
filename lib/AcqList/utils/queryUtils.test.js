import * as queryUtils from './queryUtils';

describe('queryUtils', () => {
  describe('buildDateRangeQuery', () => {
    it('should return query based on filter key and value', () => {
      expect(
        queryUtils.buildDateRangeQuery('date', '2014-07-14:20120-07-14'),
      ).toEqual('(date>="2014-07-14" and date<="20120-07-14")');
    });
  });
});
