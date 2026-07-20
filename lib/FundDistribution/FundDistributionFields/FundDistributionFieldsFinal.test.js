import { MemoryRouter } from 'react-router-dom';
import { FormSpy } from 'react-final-form';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { validateRequired } from '../../utils';
import { FUND_DISTR_TYPE } from '../../constants';
import FundDistributionFieldsFinal from './FundDistributionFieldsFinal';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  validateRequired: jest.fn(() => undefined),
}));

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
  amounts = {},
  funds = FUNDS,
  hasValidationError = false,
  onAdd = (fields) => fields.push({ distributionType: FUND_DISTR_TYPE.percent, value: 100 }),
  onRemove = (fields, index) => fields.remove(index),
  onSelectFund = () => {},
  totalAmount = 0,
  validate = jest.fn(),
  ...rest
}) => (
  <form>
    <FundDistributionFieldsFinal
      amounts={amounts}
      currency="USD"
      expenseClassesByFundId={{}}
      funds={funds}
      hasValidationError={hasValidationError}
      id="fund-distribution"
      name="fund-distribution"
      onAdd={onAdd}
      onRemove={onRemove}
      onSelectFund={onSelectFund}
      totalAmount={totalAmount}
      validate={validate}
      {...rest}
    />
    <FormSpy subscription={{ errors: true }}>
      {({ errors }) => <div data-testid="form-errors">{JSON.stringify(errors)}</div>}
    </FormSpy>
    <button type="submit">Submit</button>
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => {}} initialValues={{ 'fund-distribution': props.fundDistribution || [] }} {...props} />
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
      amounts: { 0: 5 },
      expenseClassesByFundId,
      fundDistribution,
      totalAmount: 5,
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
      fundDistribution,
      onSelectFund,
    });

    expect(await screen.findByRole('list')).toBeInTheDocument();

    const fieldSelectionInput = screen.getAllByText('stripes-components.selection.controlLabel');

    await userEvent.click(fieldSelectionInput[0]);
    await userEvent.click(screen.getAllByText('african (AFRICAHIST)')[0]);
    await userEvent.tab();

    expect(validation).toHaveBeenCalled();
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

  it('should not render the add button when disabled', () => {
    renderComponent({ disabled: true });

    expect(screen.queryByText('stripes-acq-components.fundDistribution.addBtn')).not.toBeInTheDocument();
  });

  it('should register hidden error field in form state when hasValidationError is true', () => {
    renderComponent({ hasValidationError: true });

    // The hidden Field('fund-distribution-error') has validate={() => true}; react-final-form
    // stores the error at errors['fund-distribution-error'] (no dots → top-level key)
    const errors = JSON.parse(screen.getByTestId('form-errors').textContent);

    expect(errors['fund-distribution-error']).toBeTruthy();
  });

  it('should not register hidden error field when hasValidationError is false', () => {
    renderComponent({ hasValidationError: false });

    const errors = JSON.parse(screen.getByTestId('form-errors').textContent);

    expect(errors['fund-distribution-error']).toBeUndefined();
  });

  it('should call onExpenseClassChange when an expense class is changed', async () => {
    const onExpenseClassChange = jest.fn();
    const expenseClassesByFundId = { [FUNDS[0].id]: [{ id: 'ec1', name: 'Electronic' }] };
    const fundDistribution = [
      {
        code: FUNDS[0].code,
        fundId: FUNDS[0].id,
        value: 100,
        distributionType: FUND_DISTR_TYPE.percent,
      },
    ];

    renderComponent({ expenseClassesByFundId, fundDistribution, onExpenseClassChange });

    const expenseClassSelect = screen.getAllByText('stripes-components.selection.controlLabel')[1];

    await userEvent.click(expenseClassSelect);
    await userEvent.click(screen.getByText('Electronic'));

    expect(onExpenseClassChange).toHaveBeenCalledWith(expect.objectContaining({
      fieldName: 'fund-distribution[0].expenseClassId',
      parentFieldName: 'fund-distribution[0]',
      value: 'ec1',
    }));
  });

  it('should filter active funds through filterFunds before rendering options', async () => {
    const filterFunds = jest.fn(funds => funds.filter(f => f.id === '1'));

    renderComponent({ filterFunds });

    await userEvent.click(screen.getByText('stripes-acq-components.fundDistribution.addBtn'));
    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));

    expect(screen.getByText('african (AFRICAHIST)')).toBeInTheDocument();
    expect(screen.queryByText('test (TEST)')).not.toBeInTheDocument();
    expect(filterFunds).toHaveBeenCalled();
  });

  it('should use function validateFieldsMap.fundId when provided as a function', async () => {
    const validateFieldsMap = { fundId: (arrayField) => [`${arrayField}.expenseClassId`] };

    renderComponent({ validateFieldsMap });

    // The component renders without errors when validateFieldsMap.fundId is a function
    expect(screen.getByText('stripes-acq-components.fundDistribution.addBtn')).toBeInTheDocument();
  });
});
