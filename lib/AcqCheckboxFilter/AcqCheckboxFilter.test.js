import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';

import '../../test/jest/__mock__';

import AcqCheckboxFilter from './AcqCheckboxFilter';

const filterOptions = [
  { label: 'Status Open', value: 'open' },
  { label: 'Status Closed', value: 'closed' },
];
const filterAccordionTitle = 'filter.status';

const renderUserFilter = (id, name, closedByDefault, onChange = noop) => (render(
  <IntlProvider locale="en">
    <AcqCheckboxFilter
      id={id}
      activeFilters={[]}
      labelId={filterAccordionTitle}
      name={name}
      closedByDefault={closedByDefault}
      onChange={onChange}
      options={filterOptions}
    />
  </IntlProvider>,
));

describe('AcqCheckboxFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByText } = renderUserFilter('statusFilter', 'statusFilter');

    expect(getByText(filterAccordionTitle)).toBeDefined();
  });

  it('should be closed by default', () => {
    const { getByRole } = renderUserFilter('statusFilter', 'statusFilter');

    expect(getByRole('tab').getAttribute('aria-expanded') || 'false').toBe('false');
  });

  it('should be opened by default when closedByDefault=false prop is passed', () => {
    const { getByRole } = renderUserFilter('statusFilter', 'statusFilter', false);

    expect(getByRole('tab').getAttribute('aria-expanded')).not.toBeFalsy();
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

    fireEvent(openStatusFilterOption, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
