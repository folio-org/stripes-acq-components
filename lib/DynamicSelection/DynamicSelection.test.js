import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import { ORDERS_API } from '../constants';
import { DynamicSelection } from './DynamicSelection';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

jest.useFakeTimers('modern');

const dataFormatter = ({ poLines }) => poLines.map(({ id, poLineNumber }) => ({ label: poLineNumber, value: id }));

const defaultProps = {
  api: ORDERS_API,
  dataFormatter,
  name: 'dynamic',
  onChange: jest.fn(),
  queryBuilder: (value) => `poLineNumber==${value}`,
};

const renderDynamicSelection = (props = {}) => render(
  <DynamicSelection
    {...defaultProps}
    {...props}
  />,
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ poLines: [{ id: 'poLine-1', poLineNumber: '11111' }] }),
  })),
};

describe('DynamicSelection', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should call debounced fetch function when \'onFilter\' was triggered', async () => {
    renderDynamicSelection();

    const input = screen.getByLabelText('stripes-components.selection.filterOptionsLabel', { selector: 'input' });

    await act(async () => {
      await user.type(input, '1');
      jest.advanceTimersByTime(1500);
    });
    await user.click(screen.getByText('stripes-components.selection.controlLabel'));

    expect(kyMock.get).toHaveBeenCalledWith(ORDERS_API, expect.objectContaining({}));
  });

  it('should call \'onChange\' when an option from list was selected', async () => {
    renderDynamicSelection();

    const input = screen.getByLabelText('stripes-components.selection.filterOptionsLabel', { selector: 'input' });

    await act(async () => {
      await user.type(input, '1');
      jest.advanceTimersByTime(1500);
    });

    user.click(screen.getByText('stripes-components.selection.controlLabel'));
    user.click(screen.getByText(/11111/));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });
});
