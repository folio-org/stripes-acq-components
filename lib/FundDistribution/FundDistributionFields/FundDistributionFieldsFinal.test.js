import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { validateRequired } from '../../utils';
import { FUND_DISTR_TYPE } from '../../constants';
import FundDistributionFieldsFinal from './FundDistributionFieldsFinal';
import { handleValidationErrorResponse } from './handleValidationErrorResponse';
import { validateFundDistributionTotal as validateFundDistributionTotalDefault } from './validateFundDistributionFinal';

jest.useFakeTimers({ advanceTimers: true });

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  validateRequired: jest.fn(() => undefined),
}));
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
    <button type="submit">Submit</button>
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} initialValues={{ 'fund-distribution': props.fundDistribution || [] }} {...props} />
  </MemoryRouter>,
);

describe('FundDistributionFieldsFinal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add new record and call select fund', async () => {
    const onSelectFund = jest.fn();

    renderComponent({ onSelectFund });

    await userEvent.click(screen.getByText('stripes-acq-components.fundDistribution.addBtn'));
    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText('african (AFRICAHIST)'));

    expect(onSelectFund).toHaveBeenCalledWith('fund-distribution[0]', '1');
  });

  it('should display fund distribution and handle clicks', async () => {
    const expenseClassesByFundId = { [FUNDS[1].id]: [{ id: 'expClassId', name: 'expClassName' }] };
    const fundDistribution = [{ code: 'TEST', fundId: '2', value: 100, distributionType: FUND_DISTR_TYPE.percent }];

    renderComponent({
      fundDistribution,
      totalAmount: 5,
      expenseClassesByFundId,
    });

    await userEvent.click(screen.getByText('stripes-acq-components.fundDistribution.addBtn'));

    expect(screen.getByText('$5.00')).toBeInTheDocument();
  });

  it('should display selected unavailable fund', () => {
    const fundDistribution = [inactiveFund];

    renderComponent({ fundDistribution });

    expect(screen.getAllByText('stripes-acq-components.fundDistribution.unavailableFund')[0]).toBeInTheDocument();
  });

  it('should display selected inactive fund', () => {
    const fundDistribution = [inactiveFund];

    renderComponent({
      fundDistribution,
      funds: fundDistribution,
    });

    expect(screen.getAllByText('TestName (TestCode) - stripes-acq-components.fundDistribution.fundStatus.Inactive')[0]).toBeInTheDocument();
  });

  it('should call fund distribution validator from props', async () => {
    const fundDistribution = [inactiveFund];

    renderComponent({
      fundDistribution,
      funds: fundDistribution,
      validateFundDistributionTotal,
    });

    const valueInput = screen.getByTestId('fundDistribution-value');

    await userEvent.type(valueInput, '100');
    await userEvent.tab();

    jest.advanceTimersByTime(DELAY * 1.5);

    expect(validateFundDistributionTotal).toHaveBeenCalled();
  });

  it('should call default fund distribution validator', async () => {
    const fundDistribution = [inactiveFund];

    renderComponent({
      fundDistribution,
      funds: fundDistribution,
      required: false,
    });

    const valueInput = screen.getByTestId('fundDistribution-value');

    await userEvent.type(valueInput, '100');
    await userEvent.tab();

    jest.advanceTimersByTime(DELAY * 1.5);

    expect(validateFundDistributionTotalDefault).toHaveBeenCalled();
  });

  it('should call validateRequired for fundId selection', async () => {
    const expenseClassesByFundId = { [FUNDS[0].id]: [{ id: 'expClassId', name: 'expClassName' }] };
    const fundDistribution = [{
      code: FUNDS[0].code,
      fundId: FUNDS[0].id,
      value: 100,
      distributionType: FUND_DISTR_TYPE.percent,
    }];
    const validation = validateRequired.mockReturnValue('error message');
    const onSelectFund = jest.fn();

    renderComponent({
      required: true,
      expenseClassesByFundId,
      onSelectFund,
      fundDistribution,
    });

    expect(await screen.findByRole('list')).toBeInTheDocument();

    const fieldSelectionInput = screen.getAllByText('stripes-components.selection.controlLabel');

    await userEvent.click(fieldSelectionInput[0]);
    await userEvent.click(screen.getAllByText('african (AFRICAHIST)')[0]);
    await userEvent.tab();

    expect(validation).toHaveBeenCalled();
  });

  it('should call \'handleValidationErrorResponse\' when validator rejected with an error', async () => {
    const fundDistribution = [inactiveFund];

    validateFundDistributionTotal.mockImplementation(() => Promise.reject(new Error('error message')));

    renderComponent({ fundDistribution, funds: fundDistribution, validateFundDistributionTotal });

    const valueInput = screen.getByTestId('fundDistribution-value');

    await act(async () => {
      await userEvent.type(valueInput, '100');
      await userEvent.tab();

      jest.advanceTimersByTime(DELAY * 1.5);
    });

    expect(handleValidationErrorResponse).toHaveBeenCalled();
  });

  it('should call onRemove handler', async () => {
    const { container } = renderComponent({});

    await userEvent.click(screen.getByText('stripes-acq-components.fundDistribution.addBtn'));
    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText('african (AFRICAHIST)'));

    const removeBtn = container.querySelector('.repeatableFieldRemoveItem button');

    expect(removeBtn).toBeInTheDocument();

    await userEvent.click(removeBtn);

    await waitFor(() => expect(container.querySelector('.repeatableFieldRemoveItem button')).not.toBeInTheDocument());
  });
});
