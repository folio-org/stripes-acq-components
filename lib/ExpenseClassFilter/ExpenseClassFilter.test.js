import noop from 'lodash/noop';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import ExpenseClassFilter from './ExpenseClassFilter';

jest.mock('./useExpenseClassOptions', () => ({
  useExpenseClassOptions: jest.fn().mockReturnValue([
    { value: '001', label: 'ExpenseClass #1' },
    { value: '002', label: 'ExpenseClass #2' },
  ]),
}));

const filterAccordionTitle = 'stripes-acq-components.filter.expenseClass';

const renderFundFilter = () => (render(
  <ExpenseClassFilter
    id="expenseClass"
    activeFilters={[]}
    name="expenseClass"
    onChange={noop}
    labelId={filterAccordionTitle}
  />,
));

describe('ExpenseClassFilter component', () => {
  it('should display passed title', () => {
    const { getByText } = renderFundFilter();

    expect(getByText(filterAccordionTitle)).toBeInTheDocument();
  });

  it('should be closed by default', () => {
    const { getByLabelText } = renderFundFilter();

    expect(getByLabelText('stripes-acq-components.filter.expenseClass filter list').getAttribute('aria-expanded') || 'false').toBe('false');
  });

  it('should render all passed options', async () => {
    const { findAllByText } = renderFundFilter();

    const renderedFilterOptions = await findAllByText(/ExpenseClass #[0-9]/);

    expect(renderedFilterOptions.length).toBe(2);
  });
});
