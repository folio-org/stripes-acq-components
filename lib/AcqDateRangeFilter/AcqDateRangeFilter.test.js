import noop from 'lodash/noop';

import {
  render,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { nativeChangeFieldValue } from '@folio/stripes/components';

import AcqDateRangeFilter from './AcqDateRangeFilter';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  nativeChangeFieldValue: jest.fn(),
}));

const FILTER_LABEL = 'some date filter';
const FILTER_NAME = 'some-date-filter';

const mockSubscribeOnReset = jest.fn();

const renderFilter = (closedByDefault, onChange = noop, dateFormat) => (render(
  <AcqDateRangeFilter
    id="some-date-filter"
    label={FILTER_LABEL}
    name={FILTER_NAME}
    closedByDefault={closedByDefault}
    onChange={onChange}
    dateFormat={dateFormat}
    subscribeOnReset={mockSubscribeOnReset}
  />,
));

describe('AcqDateRangeFilter component', () => {
  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText(FILTER_LABEL)).toBeDefined();
  });

  it('should be closed by default', () => {
    const { container } = renderFilter();
    const button = container.querySelector('[id="accordion-toggle-button-some-date-filter"]');

    expect(button.getAttribute('aria-expanded') || 'false').toBe('false');
  });

  it('should subscribe to reset events', () => {
    renderFilter();

    expect(mockSubscribeOnReset).toHaveBeenCalled();
  });

  it('should be opened by default when closedByDefault=false prop is passed', () => {
    const { container } = renderFilter(false);
    const button = container.querySelector('[id="accordion-toggle-button-some-date-filter"]');

    expect(button.getAttribute('aria-expanded')).not.toBeFalsy();
  });

  it('should invoke onChange callback when date is entered and Applied', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByLabelText } = renderFilter(false, onChangeFilter, 'YYYY-DD-MM');
    const fromDate = getByLabelText('stripes-smart-components.dateRange.from');
    const toDate = getByLabelText('stripes-smart-components.dateRange.to');
    const button = container.querySelector('[data-test-apply-button="true"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    await userEvent.type(fromDate, '2000-01-01');
    await userEvent.type(toDate, '2020-01-01');

    expect(onChangeFilter).not.toHaveBeenCalled();

    await userEvent.click(button);

    expect(onChangeFilter).toHaveBeenCalled();
  });

  it('should invoke onChange callback when customDateFormat used', async () => {
    const onChangeFilter = jest.fn();
    const { container, getByLabelText } = renderFilter(false, onChangeFilter);
    const fromDate = getByLabelText('stripes-smart-components.dateRange.from');
    const toDate = getByLabelText('stripes-smart-components.dateRange.to');
    const button = container.querySelector('[data-test-apply-button="true"]');

    expect(button).toBeEnabled();
    expect(onChangeFilter).not.toHaveBeenCalled();

    await userEvent.type(fromDate, '01/01/2000');
    await userEvent.type(toDate, '01/01/2000');

    expect(onChangeFilter).not.toHaveBeenCalled();

    await userEvent.click(button);

    expect(onChangeFilter).toHaveBeenCalled();
  });

  describe('when reset handler is called', () => {
    it('should clear dates', async () => {
      let callResetHandler;

      mockSubscribeOnReset.mockImplementation(cb => {
        callResetHandler = cb;
      });

      const { getByLabelText } = renderFilter(false, () => {}, 'YYYY-DD-MM');
      const fromDate = getByLabelText('stripes-smart-components.dateRange.from');
      const toDate = getByLabelText('stripes-smart-components.dateRange.to');

      await userEvent.type(fromDate, '2000-01-01');
      await userEvent.type(toDate, '2020-01-01');

      expect(fromDate).toHaveValue('2000-01-01');
      expect(toDate).toHaveValue('2020-01-01');

      callResetHandler();

      await waitFor(() => expect(nativeChangeFieldValue).toHaveBeenCalledTimes(2));
    });
  });
});
