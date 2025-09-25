import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  DICT_EXPENSE_CLASSES,
  FUND_DISTR_TYPE,
} from '../../constants';
import FundDistributionViewContainer from './FundDistributionViewContainer';
import { useFundsDistribution } from './useFundsDistribution';

jest.mock('./useFundsDistribution', () => ({
  useFundsDistribution: jest.fn(),
}));

const FUNDS = [{ id: '1', code: 'AFRICAHIST', name: 'african' }];
const TRANSACTIONS = [{
  'id': 'ad6da468-49fb-419d-9432-6e086823b91f',
  'amount': 33.0,
  'currency': 'USD',
  'encumbrance': {
    'amountAwaitingPayment': 0.0,
    'amountExpended': 0.0,
    'initialAmountEncumbered': 33.0,
    'status': 'Unreleased',
    'orderType': 'One-Time',
    'orderStatus': 'Open',
    'subscription': false,
    'reEncumber': false,
    'sourcePurchaseOrderId': '17eb6bcf-d811-45b8-9c1c-ba3ab24f9173',
    'sourcePoLineId': '50ccb873-b241-4e25-b3f4-f23ad5889911',
  },
  'expenseClassId': '1bcc3247-99bf-4dca-9b0f-7bc51a2998c2',
  'fiscalYearId': '684b5dc5-92f6-4db7-b996-b549d88f5e4e',
  'fromFundId': '7fbd5d84-62d1-44c6-9c45-6cb173998bbd',
  'source': 'PoLine',
  'transactionType': 'Encumbrance',
}];
const BUDGET = { id: 'budgetId', fundId: FUNDS[0].id };
const DISTRIBUTION = [{
  distributionType: FUND_DISTR_TYPE.amount,
  fund: FUNDS[0],
  fundBudget: BUDGET,
  fundEncumbrance: TRANSACTIONS[0],
  fundExpenseClass: { id: DICT_EXPENSE_CLASSES.UNDEFINED, name: 'Undefined' },
  fundName: `${FUNDS[0].name} (${FUNDS[0].code})`,
  value: 33,
}];

const defaultProps = {
  totalAmount: 33,
};

const renderComponent = (props = {}) => render(
  <FundDistributionViewContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('FundDistributionViewContainer', () => {
  beforeEach(() => {
    useFundsDistribution.mockReturnValue({ fundsDistribution: DISTRIBUTION });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading', async () => {
    useFundsDistribution.mockReturnValue({ isFetching: true });

    const { container } = renderComponent();

    await waitFor(() => expect(container.querySelector('.spinner')).toBeInTheDocument());
  });

  it('should display fund distribution info', async () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.fundDistribution.name')).toBeInTheDocument();
    expect(screen.getByText(DISTRIBUTION[0].fundName)).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.fundDistribution.expenseClass')).toBeInTheDocument();
    expect(screen.getByText(DISTRIBUTION[0].fundExpenseClass.name)).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.fundDistribution.value')).toBeInTheDocument();
    expect(screen.getByText(DISTRIBUTION[0].value)).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.fundDistribution.amount')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.fundDistribution.initialEncumbrance')).toBeInTheDocument();
    expect(screen.getByText(DISTRIBUTION[0].fundEncumbrance.encumbrance.initialAmountEncumbered)).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.fundDistribution.currentEncumbrance')).toBeInTheDocument();
    expect(screen.getByText(DISTRIBUTION[0].fundEncumbrance.amount)).toBeInTheDocument();
  });
});
