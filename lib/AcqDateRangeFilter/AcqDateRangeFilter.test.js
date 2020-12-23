import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { noop } from 'lodash';

import AcqDateRangeFilter from './AcqDateRangeFilter';

const FILTER_LABEL = 'some date filter';
const FILTER_NAME = 'some-date-filter';

const renderFilter = (closedByDefault, onChange = noop, dateFormat) => (render(
  <AcqDateRangeFilter
    id="some-date-filter"
    label={FILTER_LABEL}
    name={FILTER_NAME}
    closedByDefault={closedByDefault}
    onChange={onChange}
    dateFormat={dateFormat}
  />,
));

describe('AcqDateRangeFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText(FILTER_LABEL)).toBeDefined();
  });

  it('should be closed by default', () => {
    const { container } = renderFilter();
    const button = container.querySelector('[id="accordion-toggle-button-some-date-filter"]');

    expect(button.getAttribute('aria-expanded') || 'false').toBe('false');
  });

  it('should be opened by default when closedByDefault=false prop is passed', () => {
    const { container } = renderFilter(false);
    const button = container.querySelector('[id="accordion-toggle-button-some-date-filter"]');

    expect(button.getAttribute('aria-expanded')).not.toBeFalsy();
  });

  it('should invoke onChange callback when date is entered and Applied', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByLabelText } = renderFilter(false, onChangeFilter);
    const fromDate = getByLabelText('stripes-smart-components.dateRange.from');
    const toDate = getByLabelText('stripes-smart-components.dateRange.to');
    const button = container.querySelector('[data-test-apply-button="true"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.change(fromDate, { target: { value: '2000-01-01' } });
    fireEvent.change(toDate, { target: { value: '2020-01-01' } });

    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(button);

    expect(onChangeFilter).toHaveBeenCalled();
  });

  it('should invoke onChange callback when customDateFormat used', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByLabelText } = renderFilter(false, onChangeFilter, 'MM/DD/YYYY');
    const fromDate = getByLabelText('stripes-smart-components.dateRange.from');
    const toDate = getByLabelText('stripes-smart-components.dateRange.to');
    const button = container.querySelector('[data-test-apply-button="true"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.change(fromDate, { target: { value: '01/01/2000' } });
    fireEvent.change(toDate, { target: { value: '01/01/2000' } });

    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(button);

    expect(onChangeFilter).toHaveBeenCalled();
  });
});
