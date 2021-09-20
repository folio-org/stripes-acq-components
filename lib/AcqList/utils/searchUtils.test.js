import * as searchUtils from './searchUtils';

import {
  SEARCH_PARAMETER,
  ASC_DIRECTION,
  DESC_DIRECTION,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SEARCH_INDEX_PARAMETER,
} from '../constants';

describe('searchUtils', () => {
  describe('buildSearch', () => {
    it('should build query string based on new params and current query', () => {
      expect(searchUtils.buildSearch({ id: 20 }, 'title=Bridge')).toBe('id=20&title=Bridge');
    });
  });

  describe('buildPaginatelessSearch', () => {
    it('should build query string based on new params and current query', () => {
      expect(searchUtils.buildPaginatelessSearch('offset=30&limit=10&title=Bridge')).toBe('title=Bridge');
    });
  });

  describe('buildSortingObj', () => {
    it('should return object with sortingField value from query string', () => {
      const sortingFieldValue = 'Bridge';
      const { sortingField } = searchUtils.buildSortingObj(`${SORTING_PARAMETER}=${sortingFieldValue}`);

      expect(sortingField).toBe(sortingFieldValue);
    });

    it('should return object with default provided sortingField value', () => {
      const defaultSorting = {
        [SORTING_PARAMETER]: 'Bridge',
      };
      const { sortingField } = searchUtils.buildSortingObj('', defaultSorting);

      expect(sortingField).toBe(defaultSorting[SORTING_PARAMETER]);
    });

    it('should return object with sortingDirection value from query string', () => {
      const { sortingDirection } = searchUtils.buildSortingObj(`${SORTING_DIRECTION_PARAMETER}=${DESC_DIRECTION}`);

      expect(sortingDirection).toBe(DESC_DIRECTION);
    });

    it('should return object with default provided sortingDirection value', () => {
      const defaultSorting = {
        [SORTING_DIRECTION_PARAMETER]: DESC_DIRECTION,
      };
      const { sortingDirection } = searchUtils.buildSortingObj('', defaultSorting);

      expect(sortingDirection).toBe(DESC_DIRECTION);
    });

    it('should return object with ASC sortingDirection value when no direction in query and no default value', () => {
      const { sortingDirection } = searchUtils.buildSortingObj('');

      expect(sortingDirection).toBe(ASC_DIRECTION);
    });
  });

  describe('buildFiltersObj', () => {
    it('should build filters object based on query string', () => {
      const searchString = `${SEARCH_PARAMETER}=Bridge&${SEARCH_INDEX_PARAMETER}=title`;
      const queryString = `${searchString}&status=COMPLETED&status=PENDING&isSystem=true`;

      expect(searchUtils.buildFiltersObj(queryString)).toEqual({
        isSystem: ['true'],
        qindex: 'title',
        query: 'Bridge',
        status: ['COMPLETED', 'PENDING'],
      });
    });
  });
});
