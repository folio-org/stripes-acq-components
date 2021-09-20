import {
  OFFSET_PARAMETER,
  LIMIT_PARAMETER,
} from '../constants';

import * as paginationUtils from './paginationUtils';

describe('paginationUtils', () => {
  describe('buildPaginationObj', () => {
    it('should return object with offset value from query string', () => {
      const offsetValue = 30;
      const { offset } = paginationUtils.buildPaginationObj(`${OFFSET_PARAMETER}=${offsetValue}`);

      expect(offset).toBe(offsetValue);
    });

    it('should return object with default provided offset value', () => {
      const defaultPagination = {
        [OFFSET_PARAMETER]: 0,
      };
      const { offset } = paginationUtils.buildPaginationObj('', defaultPagination);

      expect(offset).toBe(defaultPagination[OFFSET_PARAMETER]);
    });

    it('should return object with limit value from query string', () => {
      const limitValue = 30;
      const { limit } = paginationUtils.buildPaginationObj(`${LIMIT_PARAMETER}=${limitValue}`);

      expect(limit).toBe(limitValue);
    });

    it('should return object with default provided limit value', () => {
      const defaultPagination = {
        [LIMIT_PARAMETER]: 0,
      };
      const { limit } = paginationUtils.buildPaginationObj('', defaultPagination);

      expect(limit).toBe(defaultPagination[LIMIT_PARAMETER]);
    });
  });
});
