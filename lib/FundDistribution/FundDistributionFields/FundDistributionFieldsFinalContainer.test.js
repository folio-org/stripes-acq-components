import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { FUND_DISTR_TYPE } from '../../constants';
import { useFunds } from '../../hooks';
import FundDistributionFieldsFinal from './FundDistributionFieldsFinal';
import FundDistributionFieldsFinalContainer from './FundDistributionFieldsFinalContainer';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useFunds: jest.fn(),
}));

const FUNDS = [{ id: '1', code: 'AFRICAHIST', name: 'african' }, { id: '2', code: 'TEST', name: 'test' }];
const expenseClasses = [{
  'id': '1bcc3247-99bf-4dca-9b0f-7bc51a2998c2',
  'code': 'Elec',
  'externalAccountNumberExt': '01',
  'name': 'Electronic',
}, {
  'id': '5b5ebe3a-cf8b-4f16-a880-46873ef21388',
  'code': 'Prn',
  'externalAccountNumberExt': '02',
  'name': 'Print',
}];

jest.mock('./FundDistributionFieldsFinal', () => {
  return jest.fn(() => 'FundDistributionFieldsFinal');
});

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

describe('FundDistributionFieldsFinalContainer', () => {
  const mutator = { fundExpenseClasses: { GET: jest.fn().mockResolvedValue(expenseClasses) } };
  const change = jest.fn();

  beforeEach(() => {
    useFunds.mockReturnValue({ funds: FUNDS });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load and pass funds and expense classes', async () => {
    const fundDistribution = [{ code: 'TEST', fundId: '2', value: 100, distributionType: FUND_DISTR_TYPE.percent }];

    renderComponent({ change, fundDistribution, mutator });

    expect(FundDistributionFieldsFinal.mock.calls[0][0].funds).toEqual(FUNDS);
    await waitFor(() => expect(FundDistributionFieldsFinal.mock.calls[1][0].expenseClassesByFundId).toEqual({ '2': expenseClasses }));
  });

  it('should call change form and fetch expense classes on fund select', async () => {
    renderComponent({ change, mutator });

    FundDistributionFieldsFinal.mock.calls[0][0].onSelectFund('fieldName', 'fundId');

    expect(mutator.fundExpenseClasses.GET).toHaveBeenCalled();
    await waitFor(() => expect(change).toHaveBeenCalledTimes(3));
  });

  it('should call change form on distribution type change', () => {
    renderComponent({ change });

    FundDistributionFieldsFinal.mock.calls[0][0].onChangeToAmount('fieldName');
    expect(change).toHaveBeenCalled();

    change.mockClear();

    FundDistributionFieldsFinal.mock.calls[0][0].onChangeToPercent('fieldName');
    expect(change).toHaveBeenCalled();
  });

  it('should fetch expense classes with fiscalYearId on fund select and reset expenseClassId', async () => {
    renderComponent({
      change,
      mutator,
      fiscalYearId: 'fiscalYearId',
    });
    FundDistributionFieldsFinal.mock.calls[0][0].onSelectFund('fieldName', 'fundId');

    expect(mutator.fundExpenseClasses.GET).toHaveBeenCalledWith({
      'params': {
        'fiscalYearId': 'fiscalYearId',
        'status': 'Active',
      },
      'path': 'finance/funds/fundId/expense-classes',
    });
  });
});
