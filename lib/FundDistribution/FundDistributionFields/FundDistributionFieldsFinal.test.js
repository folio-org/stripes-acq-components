import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import { FUND_DISTR_TYPE } from '../../constants';
import FundDistributionFieldsFinal from './FundDistributionFieldsFinal';
import { handleValidationErrorResponse } from './handleValidationErrorResponse';
import { validateFundDistributionTotal as validateFundDistributionTotalDefault } from './validateFundDistributionFinal';

jest.useFakeTimers('modern');
jest.mock('./handleValidationErrorResponse', () => ({
  handleValidationErrorResponse: jest.fn(() => 'error message'),
}));
jest.mock('./validateFundDistributionFinal', () => ({
  ...jest.requireActual('./validateFundDistributionFinal'),
  validateFundDistributionTotal: jest.fn(() => Promise.resolve()),
}));

const DELAY = 500;
const validateFundDistributionTotal = jest.fn(() => Promise.resolve());
const FUNDS = [
  { id: '1', code: 'AFRICAHIST', name: 'african', fundStatus: 'Active' },
  { id: '2', code: 'TEST', name: 'test', fundStatus: 'Active' },
];
const inactiveFund = {
  name: 'TestName',
  code: 'TestCode',
  fundId: 'fundId',
  fundStatus: 'Inactive',
  id: 'fundId',
};

// eslint-disable-next-line react/prop-types
const renderForm = ({
  fundDistribution,
  onSelectFund = () => { },
  totalAmount = 0,
  funds = FUNDS,
  ...rest
}) => (
  <form>
    <FundDistributionFieldsFinal
      currency="USD"
      expenseClassesByFundId={{}}
      fundDistribution={fundDistribution}
      funds={funds}
      id="fund-distribution"
      name="fund-distribution"
      onSelectFund={onSelectFund}
      totalAmount={totalAmount}
      {...rest}
    />
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} initialValues={{ 'fund-distribution': props.fundDistribution || [] }} {...props} />
  </MemoryRouter>,
));

describe('FundDistributionFieldsFinal', () => {
  beforeEach(() => {
    handleValidationErrorResponse.mockClear();
    validateFundDistributionTotal.mockClear();
    validateFundDistributionTotalDefault.mockClear();
  });

  it('should add new record and call select fund', () => {
    const onSelectFund = jest.fn();

    renderComponent({ onSelectFund });
    user.click(screen.getByText('stripes-acq-components.fundDistribution.addBtn'));
    user.click(screen.getByText('african (AFRICAHIST)'));

    expect(onSelectFund).toHaveBeenCalledWith('fund-distribution[0]', '1');
  });

  it('should display fund distribution and handle clicks', () => {
    const expenseClassesByFundId = { [FUNDS[1].id]: [{ id: 'expClassId', name: 'expClassName' }] };
    const fundDistribution = [{ code: 'TEST', fundId: '2', value: 100, distributionType: FUND_DISTR_TYPE.percent }];

    renderComponent({ fundDistribution, totalAmount: 5, expenseClassesByFundId });
    user.click(screen.getByText('stripes-acq-components.fundDistribution.addBtn'));
    expect(screen.getByText('$5.00')).toBeDefined();
  });

  it('should display selected unavailable fund', () => {
    const fundDistribution = [inactiveFund];

    renderComponent({ fundDistribution });

    expect(screen.getAllByText('stripes-acq-components.fundDistribution.unavailableFund')).toBeDefined();
  });

  it('should display selected inactive fund', () => {
    const fundDistribution = [inactiveFund];

    renderComponent({ fundDistribution, funds: fundDistribution });

    expect(screen.getAllByText('TestName (TestCode) - stripes-acq-components.fundDistribution.fundStatus.Inactive')).toBeDefined();
  });

  it('should call fund distribution validator from props', () => {
    const fundDistribution = [inactiveFund];

    renderComponent({ fundDistribution, funds: fundDistribution, validateFundDistributionTotal });

    const valueInput = screen.getByTestId('fundDistribution-value');

    user.type(valueInput, '100');
    user.tab();

    jest.advanceTimersByTime(DELAY * 1.5);

    expect(validateFundDistributionTotal).toHaveBeenCalled();
  });

  it('should call default fund distribution validator', () => {
    const fundDistribution = [inactiveFund];

    renderComponent({ fundDistribution, funds: fundDistribution, required: false });

    const valueInput = screen.getByTestId('fundDistribution-value');

    user.type(valueInput, '100');
    user.tab();

    jest.advanceTimersByTime(DELAY * 1.5);

    expect(validateFundDistributionTotalDefault).toHaveBeenCalled();
  });

  it('should call \'handleValidationErrorResponse\' when validator rejected with an error', async () => {
    const fundDistribution = [inactiveFund];

    // eslint-disable-next-line prefer-promise-reject-errors
    validateFundDistributionTotal.mockClear().mockReturnValue(Promise.reject('error message'));

    renderComponent({ fundDistribution, funds: fundDistribution, validateFundDistributionTotal });

    const valueInput = screen.getByTestId('fundDistribution-value');

    await act(async () => {
      user.type(valueInput, '100');
      user.tab();

      jest.advanceTimersByTime(DELAY * 1.5);
    });

    expect(handleValidationErrorResponse).toHaveBeenCalled();
  });
});
