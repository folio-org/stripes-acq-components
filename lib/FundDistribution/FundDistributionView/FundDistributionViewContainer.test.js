import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

import { DICT_EXPENSE_CLASSES, DICT_FUNDS } from '../../constants';
import FundDistributionView from './FundDistributionView';
import FundDistributionViewContainer from './FundDistributionViewContainer';

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
const MUTATOR = {
  [DICT_FUNDS]: { GET: jest.fn().mockResolvedValue(FUNDS) },
  fundDistributionEncumbrances: { GET: jest.fn().mockResolvedValue(TRANSACTIONS) },
};
const RESOURCES = { [DICT_EXPENSE_CLASSES]: { records: [{ id: 'id1', name: 'name 1' }] } };

jest.mock('./FundDistributionView', () => {
  return jest.fn(() => 'FundDistributionView');
});

const renderComponent = (props = {}) => (render(
  <FundDistributionViewContainer
    mutator={MUTATOR}
    totalAmount={33}
    resources={RESOURCES}
    {...props}
  />,
));

describe('FundDistributionViewContainer', () => {
  beforeEach(() => {
    FundDistributionView.mockClear();
  });

  it('should display loading', async () => {
    const { container } = renderComponent();

    await waitFor(() => expect(container.querySelector('.spinner')).toBeDefined());
  });

  it('should pass fund distribution hydrated', async () => {
    const fundDistributions = [{
      code: 'AFRICAHIST',
      distributionType: 'percentage',
      encumbrance: 'ad6da468-49fb-419d-9432-6e086823b91f',
      expenseClassId: '1bcc3247-99bf-4dca-9b0f-7bc51a2998c2',
      fundId: '1',
      value: 100,
    }];

    renderComponent({ fundDistributions });
    await waitFor(() => {
      return expect(FundDistributionView.mock.calls[0][0].fundsToDisplay).toEqual([{
        ...fundDistributions[0],
        fundName: `${FUNDS[0].name}(${FUNDS[0].code})`,
        fundEncumbrance: TRANSACTIONS[0],
      }]);
    });
  });

  it('should pass expense classes', async () => {
    renderComponent();
    await waitFor(() => {
      return expect(FundDistributionView.mock.calls[0][0].expenseClasses)
        .toEqual(RESOURCES[DICT_EXPENSE_CLASSES].records);
    });
  });
});
