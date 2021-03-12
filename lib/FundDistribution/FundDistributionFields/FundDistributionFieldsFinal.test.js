import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import { FUND_DISTR_TYPE } from '../../constants';
import FundDistributionFieldsFinal from './FundDistributionFieldsFinal';

const FUNDS = [{ id: '1', code: 'AFRICAHIST', name: 'african' }, { id: '2', code: 'TEST', name: 'test' }];

// eslint-disable-next-line react/prop-types
const renderForm = ({ fundDistribution, onSelectFund = () => { }, totalAmount }) => (
  <form>
    <FundDistributionFieldsFinal
      currency="USD"
      expenseClassesByFundId={{}}
      fundDistribution={fundDistribution}
      funds={FUNDS}
      id="fund-distribution"
      name="fund-distribution"
      onSelectFund={onSelectFund}
      totalAmount={totalAmount}
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
  it('should add new record and call select fund', () => {
    const onSelectFund = jest.fn();

    renderComponent({ onSelectFund });
    user.click(screen.getByText('stripes-acq-components.fundDistribution.addBtn'));
    user.click(screen.getByText('african (AFRICAHIST)'));

    expect(onSelectFund).toHaveBeenCalledWith('fund-distribution[0]', '1');
  });

  it('should display fund distribution and handle clicks', () => {
    const fundDistribution = [{ code: 'TEST', fundId: '2', value: 100, distributionType: FUND_DISTR_TYPE.percent }];

    renderComponent({ fundDistribution, totalAmount: 5 });
    user.click(screen.getByText('stripes-acq-components.fundDistribution.addBtn'));
    expect(screen.getByText('$5.00')).toBeDefined();
  });
});
