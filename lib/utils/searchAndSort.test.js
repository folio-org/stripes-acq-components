import {
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
} from './searchAndSort';

describe('searchAndSort', () => {
  describe('getActiveFilters', () => {
    it('should return empty filters object', () => {
      const filters = getActiveFilters.bind({ props: { resources: {} } })();

      expect(filters).toEqual({});
    });

    it('should return filters object from string', () => {
      const filters = getActiveFilters.bind({ props: { resources: { query: { filters: 'filter.value' } } } })();

      expect(filters).toHaveProperty('filter', ['value']);
    });
  });

  describe('handleFilterChange', () => {
    it('should call update on query', () => {
      const update = jest.fn();
      const context = {
        getActiveFilters: () => ({ filter1: ['value1'] }),
        props: { mutator: { query: { update } } },
      };

      handleFilterChange.bind(context)({ name: 'filter1', values: ['value1', 'value2'] });
      expect(update).toHaveBeenCalledWith({ filters: 'filter1.value1,filter1.value2' });
    });
  });

  describe('changeSearchIndex', () => {
    it('should call update on query', () => {
      const update = jest.fn();
      const context = {
        props: { mutator: { query: { update } } },
      };

      changeSearchIndex.bind(context)({ target: { value: 'value1' } });
      expect(update).toHaveBeenCalledWith({ qindex: 'value1' });
    });
  });
});
