import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { noop } from 'lodash';

import NumberRangeFilter from './NumberRangeFilter';

const FILTER_LABEL = 'NumberRangeFilterLabel';
const FILTER_NAME = 'NumberRangeFilterName';
const ACCORDION_ID = 'numberRangeFilter';

const renderFilter = (closedByDefault, onChange = noop) => (render(
  <NumberRangeFilter
    id={ACCORDION_ID}
    labelId={FILTER_LABEL}
    name={FILTER_NAME}
    closedByDefault={closedByDefault}
    onChange={onChange}
  />,
));

describe('NumberRangeFilter component', () => {
  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText(FILTER_LABEL)).toBeDefined();
  });

  it('should be closed by default', () => {
    const { container } = renderFilter();
    const button = container.querySelector(`[id="accordion-toggle-button-${ACCORDION_ID}"]`);

    expect(button.getAttribute('aria-expanded') || 'false').toBe('false');
  });

  it('should be opened by default when closedByDefault=false prop is passed', () => {
    const { container } = renderFilter(false);
    const button = container.querySelector(`[id="accordion-toggle-button-${ACCORDION_ID}"]`);

    expect(button.getAttribute('aria-expanded')).not.toBeFalsy();
  });

  it('should invoke onChange callback when data is entered and applied', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByLabelText } = renderFilter(false, onChangeFilter);
    const min = getByLabelText('stripes-acq-components.filter.numberRange.min');
    const max = getByLabelText('stripes-acq-components.filter.numberRange.max');
    const button = container.querySelector('[data-test-apply-button="true"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.change(min, { target: { value: '10' } });
    fireEvent.change(max, { target: { value: '100' } });

    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(button);

    expect(onChangeFilter).toHaveBeenCalled();
  });

  it('should not invoke onChange callback when data is not entered but applied', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByLabelText } = renderFilter(false, onChangeFilter);
    const min = getByLabelText('stripes-acq-components.filter.numberRange.min');
    const max = getByLabelText('stripes-acq-components.filter.numberRange.max');
    const button = container.querySelector('[data-test-apply-button="true"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.change(min, { target: { value: '' } });
    fireEvent.change(max, { target: { value: '' } });

    expect(onChangeFilter).not.toHaveBeenCalled();

    fireEvent.click(button);

    expect(onChangeFilter).not.toHaveBeenCalled();
  });
});
