import { FILTER_OPERATORS } from './constants';
import { filterAndSort } from './filterAndSort';

const orders = [
  {
    id: 'o-1',
    status: 'open',
    total: 1500,
    createdAt: '2024-06-01T10:00:00Z',
    customer: { name: 'Alice Johnson' },
    notes: 'Urgent delivery',
    paid: true,
  },
  {
    id: 'o-2',
    status: 'closed',
    total: 700,
    createdAt: '2024-06-10T12:30:00Z',
    customer: { name: 'Bob Smith' },
    notes: 'Repeat order',
    paid: false,
  },
  {
    id: 'o-3',
    status: 'open',
    total: 200,
    createdAt: '2024-07-01T08:00:00Z',
    customer: { name: 'Charlie Kim' },
    notes: '',
    paid: true,
  },
];

const config = {
  filtersConfig: {
    status: {
      field: 'status',
      operator: FILTER_OPERATORS.equals,
      type: 'string',
    },
    totalMin: {
      field: 'total',
      operator: FILTER_OPERATORS.greaterThanOrEqual,
      type: 'number',
    },
    totalMax: {
      field: 'total',
      operator: FILTER_OPERATORS.lessThanOrEqual,
      type: 'number',
    },
    createdBefore: {
      field: 'createdAt',
      operator: FILTER_OPERATORS.lessThan,
      type: 'date',
    },
    paid: {
      field: 'paid',
      operator: FILTER_OPERATORS.equals,
      type: 'boolean',
    },
    customer: {
      field: 'customer.name',
      operator: FILTER_OPERATORS.includes,
      type: 'string',
    },
    notes: {
      field: 'notes',
      operator: FILTER_OPERATORS.startsWith,
      type: 'string',
    },
    customField: {
      field: 'total',
      customFilter: (itemVal, filterVal) => itemVal % filterVal === 0,
    },
  },
  sortingConfig: {
    total: {
      field: 'total',
      type: 'number',
    },
    createdAt: {
      field: 'createdAt',
      type: 'date',
    },
  },
  keywordKey: 'search',
  searchIndexes: ['customer.name', 'notes'],
};

describe('filterAndSort full coverage', () => {
  test('returns all when filters empty', () => {
    const result = filterAndSort(config, {}, orders);

    expect(result).toHaveLength(3);
  });

  test('filters by exact status equals', () => {
    const result = filterAndSort(config, { status: 'open' }, orders);

    expect(result.map(o => o.id).sort()).toEqual(['o-1', 'o-3']);
  });

  test('filters by min total (gte)', () => {
    const result = filterAndSort(config, { totalMin: 700 }, orders);

    expect(result.map(o => o.id).sort()).toEqual(['o-1', 'o-2']);
  });

  test('filters by max total (lte)', () => {
    const result = filterAndSort(config, { totalMax: 700 }, orders);

    expect(result.map(o => o.id).sort()).toEqual(['o-2', 'o-3']);
  });

  test('filters by createdBefore (date lt)', () => {
    const result = filterAndSort(config, { createdBefore: '2024-07-01T00:00:00Z' }, orders);

    expect(result.map(o => o.id).sort()).toEqual(['o-1', 'o-2']);
  });

  test('filters by boolean paid true', () => {
    const result = filterAndSort(config, { paid: true }, orders);

    expect(result.map(o => o.id).sort()).toEqual(['o-1', 'o-3']);
  });

  test('filters by includes on customer.name', () => {
    const result = filterAndSort(config, { customer: 'bob' }, orders);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('o-2');
  });

  test('filters by startsWith on notes', () => {
    const result = filterAndSort(config, { notes: 'Urg' }, orders);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('o-1');
  });

  test('filters by array of status values (OR logic)', () => {
    const result = filterAndSort(config, { status: ['open', 'closed'] }, orders);

    expect(result).toHaveLength(3);
  });

  test('filters by custom filter', () => {
    const result = filterAndSort(config, { customField: 500 }, orders);

    expect(result.map(o => o.id).sort()).toEqual(['o-1']);
  });

  test('filters by search keyword across searchIndexes', () => {
    const result = filterAndSort(config, { search: 'urgent' }, orders);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('o-1');
  });

  test('search is case insensitive and trims', () => {
    const result = filterAndSort(config, { search: '  UrGeNt ' }, orders);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('o-1');
  });

  test('sorts by total ascending', () => {
    const result = filterAndSort(config, { sorting: 'total', sortingDirection: 'ascending' }, orders);

    expect(result.map(o => o.id)).toEqual(['o-3', 'o-2', 'o-1']);
  });

  test('sorts by total descending', () => {
    const result = filterAndSort(config, { sorting: 'total', sortingDirection: 'descending' }, orders);

    expect(result.map(o => o.id)).toEqual(['o-1', 'o-2', 'o-3']);
  });

  test('sorts by createdAt ascending', () => {
    const result = filterAndSort(config, { sorting: 'createdAt', sortingDirection: 'ascending' }, orders);

    expect(result.map(o => o.id)).toEqual(['o-1', 'o-2', 'o-3']);
  });

  test('sorts by createdAt descending', () => {
    const result = filterAndSort(config, { sorting: 'createdAt', sortingDirection: 'descending' }, orders);

    expect(result.map(o => o.id)).toEqual(['o-3', 'o-2', 'o-1']);
  });

  test('filters skip if filter value is null or undefined', () => {
    const result = filterAndSort(config, { status: null, paid: undefined }, orders);

    expect(result).toHaveLength(3);
  });

  test('handles missing fields gracefully', () => {
    const itemsWithMissing = [...orders, { id: 'o-4' }];
    const result = filterAndSort(config, { status: 'open' }, itemsWithMissing);

    expect(result.map(o => o.id)).toEqual(expect.arrayContaining(['o-1', 'o-3']));
  });

  describe('Additional edge cases', () => {
    const baseFiltersConfig = {
      nameStarts: {
        field: 'customer.name',
        operator: FILTER_OPERATORS.startsWith,
        type: 'string',
      },
      notesEnds: {
        field: 'notes',
        operator: FILTER_OPERATORS.endsWith,
        type: 'string',
      },
      caseSensitiveField: {
        field: 'status',
        caseSensitive: true,
      },
    };

    const baseSortingConfig = {
      customSortedField: {
        customSort: (a, b) => {
          return (a.notes?.length || 0) - (b.notes?.length || 0);
        },
      },
    };

    const _config = {
      filtersConfig: baseFiltersConfig,
      sortingConfig: baseSortingConfig,
      keywordKey: 'search',
      searchIndexes: ['customer.name', 'notes'],
    };

    test('filters with startsWith operator', () => {
      const result = filterAndSort(_config, { nameStarts: 'Ali' }, orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('o-1');
    });

    test('filters with endsWith operator', () => {
      const result = filterAndSort(_config, { notesEnds: 'order' }, orders);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('o-2');
    });

    test('filters with caseSensitive = true', () => {
      const result = filterAndSort(_config, { caseSensitiveField: 'Open' }, orders);

      expect(result.length).toBe(0);
    });

    test('filters with caseSensitive = true exact match', () => {
      const result = filterAndSort(_config, { caseSensitiveField: 'open' }, orders);

      expect(result.length).toBe(2);
    });

    test('filters with array of values with customFilter', () => {
      const customFilter = jest.fn((itemVal, filterVal) => itemVal === filterVal);
      const arrayFilterConfig = {
        myField: {
          field: 'status',
          customFilter,
        },
      };
      const configWithCustom = {
        ..._config,
        filtersConfig: arrayFilterConfig,
      };

      const filters = { myField: ['open', 'closed'] };

      filterAndSort(configWithCustom, filters, orders);

      expect(customFilter).toHaveBeenCalled();
    });

    test('sort with customSort is called', () => {
      const filters = { sorting: 'customSortedField', sortingDirection: 'ascending' };
      const sorted = filterAndSort(_config, filters, orders);

      for (let i = 1; i < sorted.length; i++) {
        expect((sorted[i].notes?.length || 0)).toBeGreaterThanOrEqual((sorted[i - 1].notes?.length || 0));
      }
    });

    test('filters skip null or undefined values', () => {
      const result = filterAndSort(_config, { status: null, paid: undefined }, orders);

      expect(result.length).toBe(3);
    });

    test('filter config without field returns true', () => {
      const configWithoutField = {
        filtersConfig: {
          fakeFilter: {},
        },
      };
      const result = filterAndSort(configWithoutField, { fakeFilter: 'any' }, orders);

      expect(result.length).toBe(3);
    });
  });
});
