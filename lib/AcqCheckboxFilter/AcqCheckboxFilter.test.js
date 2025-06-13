import noop from 'lodash/noop';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import AcqCheckboxFilter from './AcqCheckboxFilter';

const filterOptions = [
  { label: 'Status Open', value: 'open' },
  { label: 'Status Closed', value: 'closed' },
];
const filterAccordionTitle = 'filter.status';

const renderUserFilter = (id, name, closedByDefault, onChange = noop) => (render(
  <AcqCheckboxFilter
    id={id}
    activeFilters={[]}
    labelId={filterAccordionTitle}
    name={name}
    closedByDefault={closedByDefault}
    onChange={onChange}
    options={filterOptions}
  />,
));

describe('AcqCheckboxFilter component', () => {
  it('should display passed title', () => {
    const { getByText } = renderUserFilter('statusFilter', 'statusFilter');

    expect(getByText(filterAccordionTitle)).toBeInTheDocument();
  });

  it('should be closed by default', () => {
    const { getByLabelText } = renderUserFilter('statusFilter', 'statusFilter');

    expect(getByLabelText('filter.status filter list').getAttribute('aria-expanded') || 'false').toBe('false');
  });

  it('should be opened by default when closedByDefault=false prop is passed', () => {
    const { getByLabelText } = renderUserFilter('statusFilter', 'statusFilter', false);

    expect(getByLabelText('filter.status filter list').getAttribute('aria-expanded')).not.toBeFalsy();
  });

  it('should render all passed options', async () => {
    const { findAllByText } = renderUserFilter('statusFilter', 'statusFilter', false);

    const renderedFilterOptions = await findAllByText(/^Status.*$/);

    expect(renderedFilterOptions.length).toBe(filterOptions.length);
  });

  it('should invoke onChange callback when click is happened', async () => {
    const onChangeFilter = jest.fn();
    const { getByLabelText } = renderUserFilter('statusFilter', 'statusFilter', false, onChangeFilter);

    const openStatusFilterOption = getByLabelText('Status Open');

    expect(onChangeFilter).not.toHaveBeenCalled();

    await userEvent.click(openStatusFilterOption);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
