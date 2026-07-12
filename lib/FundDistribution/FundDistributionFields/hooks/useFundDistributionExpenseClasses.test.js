import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { fetchFundExpenseClasses } from '../../../utils';
import { useFundDistributionExpenseClasses } from './useFundDistributionExpenseClasses';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useNamespace: jest.fn(() => ['test-namespace']),
}));

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  fetchFundExpenseClasses: jest.fn(),
}));

const buildWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return {
    client,
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  };
};

const EC_FUND1 = [
  { id: 'ec2', name: 'Zebra' },
  { id: 'ec1', name: 'Alpha' },
];

describe('useFundDistributionExpenseClasses', () => {
  const kyExtendMock = { get: jest.fn() };
  const kyMock = { extend: jest.fn(() => kyExtendMock) };
  const fetchFn = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    useNamespace.mockReturnValue(['test-namespace']);
    fetchFundExpenseClasses.mockReturnValue(fetchFn);
    fetchFn.mockResolvedValue(EC_FUND1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty object when fundDistribution is empty', () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(
      () => useFundDistributionExpenseClasses({ fundDistribution: [] }),
      { wrapper },
    );

    expect(result.current.expenseClassesByFundId).toEqual({});
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('should return empty object when fundDistribution is undefined', () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(
      () => useFundDistributionExpenseClasses({ fundDistribution: undefined }),
      { wrapper },
    );

    expect(result.current.expenseClassesByFundId).toEqual({});
  });

  it('should deduplicate fund IDs and issue one request per unique fund', async () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(
      () => useFundDistributionExpenseClasses({
        fundDistribution: [
          { fundId: 'fund1' },
          { fundId: 'fund1' }, // duplicate
          { fundId: 'fund2' },
        ],
      }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('should sort expense classes alphabetically by name', async () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(
      () => useFundDistributionExpenseClasses({
        fundDistribution: [{ fundId: 'fund1' }],
      }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.expenseClassesByFundId.fund1).toEqual([
      { id: 'ec1', name: 'Alpha' },
      { id: 'ec2', name: 'Zebra' },
    ]);
  });

  it('should include fiscalYearId in searchParams when provided', async () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(
      () => useFundDistributionExpenseClasses({
        fiscalYearId: 'fy1',
        fundDistribution: [{ fundId: 'fund1' }],
      }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(fetchFn).toHaveBeenCalledWith('fund1', {
      searchParams: { status: 'Active', fiscalYearId: 'fy1' },
    });
  });

  it('should omit fiscalYearId from searchParams when not provided', async () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(
      () => useFundDistributionExpenseClasses({
        fundDistribution: [{ fundId: 'fund1' }],
      }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(fetchFn).toHaveBeenCalledWith('fund1', {
      searchParams: { status: 'Active' },
    });
    expect(fetchFn.mock.calls[0][1].searchParams).not.toHaveProperty('fiscalYearId');
  });

  it('should skip entries without a fundId', async () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(
      () => useFundDistributionExpenseClasses({
        fundDistribution: [{ fundId: null }, { fundId: undefined }, { fundId: 'fund1' }],
      }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith('fund1', expect.anything());
  });

  it('should reflect isFetching and isLoading as false once queries settle', async () => {
    const { wrapper } = buildWrapper();
    const { result } = renderHook(
      () => useFundDistributionExpenseClasses({
        fundDistribution: [{ fundId: 'fund1' }],
      }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
