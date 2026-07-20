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

import { FUND_DISTR_TYPE } from '../../../constants';
import { fetchFundExpenseClasses } from '../../../utils';
import { useFundDistributionHandlers } from './useFundDistributionHandlers';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useNamespace: jest.fn(() => ['test-namespace']),
}));

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  fetchFundExpenseClasses: jest.fn(),
}));

const FUNDS = [
  { id: 'fund1', code: 'CODE1' },
  { id: 'fund2', code: 'CODE2' },
];

const buildWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return {
    client,
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  };
};

describe('useFundDistributionHandlers', () => {
  const change = jest.fn();
  const fetchExpenseClassesFn = jest.fn(() => Promise.resolve([]));

  beforeEach(() => {
    useOkapiKy.mockReturnValue({});
    useNamespace.mockReturnValue(['test-namespace']);
    fetchFundExpenseClasses.mockReturnValue(fetchExpenseClassesFn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onAdd', () => {
    it('should push a percent distribution entry with value 100', () => {
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      const fields = { push: jest.fn() };

      result.current.onAdd(fields);

      expect(fields.push).toHaveBeenCalledWith({ distributionType: FUND_DISTR_TYPE.percent, value: 100 });
    });
  });

  describe('onRemove', () => {
    it('should call fields.remove with the given index', () => {
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      const fields = { remove: jest.fn() };

      result.current.onRemove(fields, 2);

      expect(fields.remove).toHaveBeenCalledWith(2);
    });
  });

  describe('onChangeToAmount', () => {
    it('should replace distributionType segment with null value', () => {
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      result.current.onChangeToAmount('fundDistribution[0].distributionType');

      expect(change).toHaveBeenCalledWith('fundDistribution[0].value', null);
    });
  });

  describe('onChangeToPercent', () => {
    it('should replace distributionType segment with 100', () => {
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      result.current.onChangeToPercent('fundDistribution[0].distributionType');

      expect(change).toHaveBeenCalledWith('fundDistribution[0].value', 100);
    });
  });

  describe('onSelectFund', () => {
    it('should set fundId, code, and encumbrance synchronously', () => {
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      result.current.onSelectFund('fundDistribution[0]', 'fund1');

      expect(change).toHaveBeenCalledWith('fundDistribution[0].fundId', 'fund1');
      expect(change).toHaveBeenCalledWith('fundDistribution[0].code', 'CODE1');
      expect(change).toHaveBeenCalledWith('fundDistribution[0].encumbrance', null);
    });

    it('should set null code when fund id is not in the funds list', () => {
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      result.current.onSelectFund('fundDistribution[0]', 'unknown-id');

      expect(change).toHaveBeenCalledWith('fundDistribution[0].code', null);
    });

    it('should include fiscalYearId in searchParams when provided', async () => {
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, fiscalYearId: 'fy1', funds: FUNDS }),
        { wrapper },
      );

      result.current.onSelectFund('fundDistribution[0]', 'fund1');

      await waitFor(() => expect(fetchExpenseClassesFn).toHaveBeenCalled());
      expect(fetchExpenseClassesFn).toHaveBeenCalledWith('fund1', {
        searchParams: { status: 'Active', fiscalYearId: 'fy1' },
      });
    });

    it('should omit fiscalYearId from searchParams when not provided', async () => {
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      result.current.onSelectFund('fundDistribution[0]', 'fund1');

      await waitFor(() => expect(fetchExpenseClassesFn).toHaveBeenCalled());
      expect(fetchExpenseClassesFn.mock.calls[0][1].searchParams).not.toHaveProperty('fiscalYearId');
    });

    it('should auto-select expenseClassId when exactly one expense class is returned', async () => {
      fetchExpenseClassesFn.mockResolvedValue([{ id: 'ec1', name: 'Electronic' }]);
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      result.current.onSelectFund('fundDistribution[0]', 'fund1');

      await waitFor(() => {
        expect(change).toHaveBeenCalledWith('fundDistribution[0].expenseClassId', 'ec1');
      });
    });

    it('should set expenseClassId to null when multiple expense classes are returned', async () => {
      fetchExpenseClassesFn.mockResolvedValue([{ id: 'ec1' }, { id: 'ec2' }]);
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      result.current.onSelectFund('fundDistribution[0]', 'fund1');

      await waitFor(() => {
        expect(change).toHaveBeenCalledWith('fundDistribution[0].expenseClassId', null);
      });
    });

    it('should set expenseClassId to null on fetch error', async () => {
      fetchExpenseClassesFn.mockRejectedValue(new Error('network error'));
      const { wrapper } = buildWrapper();
      const { result } = renderHook(
        () => useFundDistributionHandlers({ change, funds: FUNDS }),
        { wrapper },
      );

      result.current.onSelectFund('fundDistribution[0]', 'fund1');

      await waitFor(() => {
        expect(change).toHaveBeenCalledWith('fundDistribution[0].expenseClassId', null);
      });
    });
  });
});
