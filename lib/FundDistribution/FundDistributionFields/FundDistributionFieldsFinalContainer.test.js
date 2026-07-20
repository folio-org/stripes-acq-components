import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import { FUND_DISTR_TYPE } from '../../constants';
import { useFunds } from '../../hooks';
import FundDistributionFieldsFinal from './FundDistributionFieldsFinal';
import FundDistributionFieldsFinalContainer from './FundDistributionFieldsFinalContainer';
import { handleValidationErrorResponse } from './handleValidationErrorResponse';
import { validateFundDistributionTotal as validateFundDistributionTotalDefault } from './validateFundDistributionFinal';
import {
  useFundDistributionExpenseClasses,
  useFundDistributionHandlers,
} from './hooks';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAsyncDebounce: jest.fn(fn => fn),
  useFunds: jest.fn(),
}));

jest.mock('./FundDistributionFieldsFinal', () => jest.fn(() => 'FundDistributionFieldsFinal'));

jest.mock('./handleValidationErrorResponse', () => ({
  handleValidationErrorResponse: jest.fn(() => 'error message'),
}));

jest.mock('./validateFundDistributionFinal', () => ({
  ...jest.requireActual('./validateFundDistributionFinal'),
  validateFundDistributionTotal: jest.fn(() => Promise.resolve()),
}));

jest.mock('./hooks', () => ({
  useFundDistributionExpenseClasses: jest.fn(),
  useFundDistributionHandlers: jest.fn(),
}));

const FUNDS = [
  { id: '1', code: 'AFRICAHIST', name: 'african', fundStatus: 'Active' },
  { id: '2', code: 'TEST', name: 'test', fundStatus: 'Active' },
];

const defaultHandlers = {
  onAdd: jest.fn(),
  onChangeToAmount: jest.fn(),
  onChangeToPercent: jest.fn(),
  onRemove: jest.fn(),
  onSelectFund: jest.fn(),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <FundDistributionFieldsFinalContainer
    currency="USD"
    name="fund-distribution"
    {...props}
  />,
  { wrapper },
);

const getLastCallProps = () => FundDistributionFieldsFinal.mock.calls.at(-1)[0];

describe('FundDistributionFieldsFinalContainer', () => {
  const change = jest.fn();

  beforeEach(() => {
    useFunds.mockReturnValue({ funds: FUNDS });
    useFundDistributionExpenseClasses.mockReturnValue({ expenseClassesByFundId: {} });
    useFundDistributionHandlers.mockReturnValue(defaultHandlers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass funds and expenseClassesByFundId to component', () => {
    const expenseClassesByFundId = { '2': [{ id: 'ec1', name: 'Electronic' }] };

    useFundDistributionExpenseClasses.mockReturnValue({ expenseClassesByFundId });
    renderComponent({ change });

    const props = getLastCallProps();

    expect(props.funds).toEqual(FUNDS);
    expect(props.expenseClassesByFundId).toEqual(expenseClassesByFundId);
  });

  it('should pass handlers from useFundDistributionHandlers to component', () => {
    renderComponent({ change });

    const props = getLastCallProps();

    expect(props.onAdd).toBe(defaultHandlers.onAdd);
    expect(props.onChangeToAmount).toBe(defaultHandlers.onChangeToAmount);
    expect(props.onChangeToPercent).toBe(defaultHandlers.onChangeToPercent);
    expect(props.onSelectFund).toBe(defaultHandlers.onSelectFund);
  });

  it('should wrap onRemove to delegate to handler', () => {
    renderComponent({ change });

    const mockFields = { remove: jest.fn(), length: 1 };

    getLastCallProps().onRemove(mockFields, 0);

    expect(defaultHandlers.onRemove).toHaveBeenCalledWith(mockFields, 0);
  });

  it('should pass computed amounts to component', () => {
    const fundDistribution = [{ value: 100, distributionType: FUND_DISTR_TYPE.percent }];

    renderComponent({ change, fundDistribution, totalAmount: 10 });

    expect(getLastCallProps().amounts[0]).toBe(10);
  });

  it('should pass filterFunds to component', () => {
    const filterFunds = jest.fn(f => f);

    renderComponent({ change, filterFunds });

    expect(getLastCallProps().filterFunds).toBe(filterFunds);
  });

  it('should show loading state while funds are loading', () => {
    useFunds.mockReturnValue({ isLoading: true });

    const { queryByText } = renderComponent({ change });

    expect(queryByText('FundDistributionFieldsFinal')).not.toBeInTheDocument();
  });

  describe('validate', () => {
    it('should call validateFundDistributionTotal from props when provided', async () => {
      const validateFundDistributionTotal = jest.fn(() => Promise.resolve());
      const fundDistribution = [{ fundId: 'f1', value: 100, distributionType: FUND_DISTR_TYPE.percent }];

      renderComponent({ change, fundDistribution, totalAmount: 5, validateFundDistributionTotal });

      await getLastCallProps().validate(fundDistribution);

      expect(validateFundDistributionTotal).toHaveBeenCalled();
      expect(validateFundDistributionTotalDefault).not.toHaveBeenCalled();
    });

    it('should call default validateFundDistributionTotal when prop not provided', async () => {
      const fundDistribution = [{ fundId: 'f1', value: 100, distributionType: FUND_DISTR_TYPE.percent }];

      renderComponent({ change, fundDistribution, totalAmount: 5 });

      await getLastCallProps().validate(fundDistribution);

      expect(validateFundDistributionTotalDefault).toHaveBeenCalled();
    });

    it('should call handleValidationErrorResponse when validator rejects', async () => {
      const fundDistribution = [{ fundId: 'f1', value: 50, distributionType: FUND_DISTR_TYPE.percent }];

      validateFundDistributionTotalDefault.mockReturnValue(Promise.reject(new Error('total mismatch')));

      renderComponent({ change, fundDistribution, totalAmount: 5 });

      await getLastCallProps().validate(fundDistribution);

      expect(handleValidationErrorResponse).toHaveBeenCalled();
    });

    it('should skip validation when records are empty', async () => {
      renderComponent({ change, totalAmount: 5 });

      await getLastCallProps().validate([]);

      expect(validateFundDistributionTotalDefault).not.toHaveBeenCalled();
    });

    it('should skip validation when a record has no fundId', async () => {
      const incompleteRecords = [{ value: 100, distributionType: FUND_DISTR_TYPE.percent }];

      renderComponent({ change, fundDistribution: incompleteRecords, totalAmount: 5 });

      await getLastCallProps().validate(incompleteRecords);

      expect(validateFundDistributionTotalDefault).not.toHaveBeenCalled();
    });

    it('should skip validation when a record value is not a number', async () => {
      const incompleteRecords = [{ fundId: 'f1', value: '50', distributionType: FUND_DISTR_TYPE.percent }];

      renderComponent({ change, fundDistribution: incompleteRecords, totalAmount: 5 });

      await getLastCallProps().validate(incompleteRecords);

      expect(validateFundDistributionTotalDefault).not.toHaveBeenCalled();
    });

    it('should skip validation when totalAmount is null', async () => {
      const records = [{ fundId: 'f1', value: 100 }];

      renderComponent({ change, fundDistribution: records, totalAmount: null });

      await getLastCallProps().validate(records);

      expect(validateFundDistributionTotalDefault).not.toHaveBeenCalled();
    });

    it('should pass hasValidationError=true to child when validation returns an error', async () => {
      const fundDistribution = [{ fundId: 'f1', value: 50, distributionType: FUND_DISTR_TYPE.percent }];

      validateFundDistributionTotalDefault.mockReturnValue(Promise.reject(new Error('total mismatch')));
      handleValidationErrorResponse.mockReturnValue('validation error');

      renderComponent({ change, fundDistribution, totalAmount: 5 });

      await getLastCallProps().validate(fundDistribution);

      await waitFor(() => expect(getLastCallProps().hasValidationError).toBe(true));
    });

    it('should pass hasValidationError=false to child when validation succeeds', async () => {
      const fundDistribution = [{ fundId: 'f1', value: 100, distributionType: FUND_DISTR_TYPE.percent }];

      validateFundDistributionTotalDefault.mockReturnValue(Promise.resolve());

      renderComponent({ change, fundDistribution, totalAmount: 5 });

      await getLastCallProps().validate(fundDistribution);

      expect(getLastCallProps().hasValidationError).toBe(false);
    });

    it('should return undefined error when required is false even if validator detects a mismatch', async () => {
      const fundDistribution = [{ fundId: 'f1', value: 50, distributionType: FUND_DISTR_TYPE.percent }];

      validateFundDistributionTotalDefault.mockReturnValue(Promise.reject(new Error('mismatch')));
      handleValidationErrorResponse.mockReturnValue('remaining amount error');

      renderComponent({ change, required: false, fundDistribution, totalAmount: 5 });

      const error = await getLastCallProps().validate(fundDistribution);

      expect(error).toBeUndefined();
    });
  });

  it('should not reset remaining amount when onRemove is called with more than one item', () => {
    const fundDistribution = [
      { fundId: 'f1', value: 50 },
      { fundId: 'f2', value: 50 },
    ];

    renderComponent({ change, fundDistribution, totalAmount: 10 });

    const mockFields = { remove: jest.fn(), length: 2 };

    getLastCallProps().onRemove(mockFields, 0);

    expect(defaultHandlers.onRemove).toHaveBeenCalledWith(mockFields, 0);
  });

  it('should use stripes.currency as fallback when currency prop is not provided', () => {
    useStripes.mockReturnValue({ currency: 'GBP' });

    render(<FundDistributionFieldsFinalContainer name="fund-distribution" change={change} />, { wrapper });

    expect(getLastCallProps().currency).toBe('GBP');
  });
});
