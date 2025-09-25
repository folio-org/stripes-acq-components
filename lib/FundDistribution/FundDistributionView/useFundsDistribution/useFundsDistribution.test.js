import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  fetchBudgets,
  fetchExpenseClassByIds,
  fetchFundByIds,
  fetchTransactionByIds,
} from '../../../utils';
import { useFundsDistribution } from './useFundsDistribution';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  fetchBudgets: jest.fn(),
  fetchExpenseClassByIds: jest.fn(),
  fetchFundByIds: jest.fn(),
  fetchTransactionByIds: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFundsDistribution', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({ extend: () => ({}) });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch fund distribution data', async () => {
    const fundDistributionsInput = [
      {
        fundId: 'fund-1',
        encumbrance: 'enc-1',
        expenseClassId: 'ec-1',
      },
    ];

    fetchFundByIds.mockImplementation(() => async (_ids) => ({ funds: [{ id: 'fund-1', name: 'Main Fund', code: 'MF' }] }));
    fetchTransactionByIds.mockImplementation(() => async (_ids) => ({ transactions: [{ id: 'enc-1', fromFundId: 'fund-1', fiscalYearId: 'fy-1' }] }));
    fetchExpenseClassByIds.mockImplementation(() => async (_ids) => ({ expenseClasses: [{ id: 'ec-1', name: 'Expense A' }] }));
    fetchBudgets.mockImplementation(() => async () => ({ budgets: [{ id: 'budget-1', fundId: 'fund-1', name: 'Budget 1' }] }));

    const { result } = renderHook(
      () => useFundsDistribution(fundDistributionsInput, { enabled: true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    // ensure utilities were called with expected id lists
    expect(fetchFundByIds).toHaveBeenCalled();
    expect(fetchTransactionByIds).toHaveBeenCalled();
    expect(fetchExpenseClassByIds).toHaveBeenCalled();
    expect(fetchBudgets).toHaveBeenCalled();
  });

  it('should handle missing fund and missing code gracefully', async () => {
    const fundDistributionsInput = [
      { fundId: 'missing-fund', encumbrance: null, expenseClassId: null },
      { fundId: 'fund-2', encumbrance: 'enc-2', expenseClassId: null },
    ];

    fetchFundByIds.mockImplementation(() => async (_ids) => ({
      funds: [
        // only fund-2 exists and has no code
        { id: 'fund-2', name: 'Secondary Fund', code: '' },
      ],
    }));

    fetchTransactionByIds.mockImplementation(() => async (_ids) => ({
      transactions: [{ id: 'enc-2', fromFundId: 'fund-2', fiscalYearId: 'fy-2' }],
    }));

    fetchExpenseClassByIds.mockImplementation(() => async (_ids) => ({ expenseClasses: [] }));
    fetchBudgets.mockImplementation(() => async () => ({ budgets: [{ id: 'budget-2', fundId: 'fund-2', name: 'Budget 2' }] }));

    const { result } = renderHook(
      () => useFundsDistribution(fundDistributionsInput),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const [missing, second] = result.current.fundsDistribution;

    // missing fund results in empty name/code fallbacks
    expect(missing.fundName).toBe('');
    expect(missing.fundBudget).toBeUndefined();
    expect(missing.fundEncumbrance).toBeUndefined();
    expect(missing.fundExpenseClass).toBeUndefined();

    // fund with empty code should not include parentheses
    expect(second.fundName).toBe('Secondary Fund');
    expect(second.fundBudget).toEqual({ id: 'budget-2', fundId: 'fund-2', name: 'Budget 2' });
    expect(second.fundEncumbrance).toEqual({ id: 'enc-2', fromFundId: 'fund-2', fiscalYearId: 'fy-2' });
    expect(second.fundExpenseClass).toBeUndefined();

    // ensure all api/util methods were used
    expect(fetchFundByIds).toHaveBeenCalled();
    expect(fetchTransactionByIds).toHaveBeenCalled();
    expect(fetchExpenseClassByIds).toHaveBeenCalled();
    expect(fetchBudgets).toHaveBeenCalled();
  });
});
