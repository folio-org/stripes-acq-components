import { FILTER_OPERATORS } from './constants';
import { filterAndSort } from './filterAndSort';

const orders = [
  {
    id: 'o-1001',
    status: 'open',
    total: 1500,
    createdAt: '2024-06-01T10:00:00Z',
    vendor: { name: 'Alice Johnson' },
    notes: 'Urgent delivery',
    isApproved: true,
  },
  {
    id: 'o-1002',
    status: 'closed',
    total: 700,
    createdAt: '2024-06-10T12:30:00Z',
    vendor: { name: 'Bob Smith' },
    notes: 'Repeat order',
    isApproved: false,
  },
  {
    id: 'o-1003',
    status: 'open',
    total: 200,
    createdAt: '2024-07-01T08:00:00Z',
    vendor: { name: 'Charlie Kim' },
    notes: '',
    isApproved: true,
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
    isApproved: {
      field: 'isApproved',
      operator: FILTER_OPERATORS.equals,
      type: 'boolean',
    },
    vendor: {
      field: 'vendor.name',
      operator: FILTER_OPERATORS.includes,
      type: 'string',
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
  searchIndexes: ['vendor.name', 'notes'],
};

describe('filterAndSort — orders', () => {
  it('filters by status and min total', () => {
    const filters = {
      status: 'open',
      totalMin: 300,
    };
    const result = filterAndSort(config, filters, orders);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('o-1001');
  });

  it('filters by vendor name (includes)', () => {
    const filters = {
      vendor: 'bob',
    };
    const result = filterAndSort(config, filters, orders);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('o-1002');
  });

  it('filters by boolean value (isApproved)', () => {
    const filters = {
      isApproved: true,
    };
    const result = filterAndSort(config, filters, orders);

    expect(result).toHaveLength(2);
    expect(result.map(o => o.id)).toEqual(expect.arrayContaining(['o-1001', 'o-1003']));
  });

  it('filters by date (createdBefore)', () => {
    const filters = {
      createdBefore: '2024-07-01T00:00:00Z',
    };
    const result = filterAndSort(config, filters, orders);

    expect(result).toHaveLength(2);
    expect(result.map(o => o.id)).toEqual(expect.arrayContaining(['o-1001', 'o-1002']));
  });

  it('applies search across name and notes', () => {
    const filters = {
      search: 'urgent',
    };
    const result = filterAndSort(config, filters, orders);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('o-1001');
  });

  it('sorts by total ascending', () => {
    const filters = {
      sorting: 'total',
      sortingDirection: 'ascending',
    };
    const result = filterAndSort(config, filters, orders);

    expect(result.map(o => o.total)).toEqual([200, 700, 1500]);
  });

  it('sorts by createdAt descending', () => {
    const filters = {
      sorting: 'createdAt',
      sortingDirection: 'descending',
    };
    const result = filterAndSort(config, filters, orders);

    expect(result.map(o => o.id)).toEqual(['o-1003', 'o-1002', 'o-1001']);
  });

  it('handles array filter (OR logic)', () => {
    const filters = {
      status: ['open', 'closed'],
    };
    const result = filterAndSort(config, filters, orders);

    expect(result).toHaveLength(3);
  });

  it('filters by totalMax only', () => {
    const filters = {
      totalMax: 1000,
    };
    const result = filterAndSort(config, filters, orders);

    expect(result).toHaveLength(2);
    expect(result.map(o => o.id)).toEqual(expect.arrayContaining(['o-1002', 'o-1003']));
  });

  it('returns all items when no filters', () => {
    const result = filterAndSort(config, {}, orders);

    expect(result).toHaveLength(3);
  });
});
