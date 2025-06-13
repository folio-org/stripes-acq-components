import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';

import { ORDERS_API } from '../constants';
import { useDebouncedQuery } from '../hooks';
import { DynamicSelection } from './DynamicSelection';

jest.useFakeTimers({ advanceTimers: true });

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useDebouncedQuery: jest.fn(() => ({
    options: [],
    isLoading: false,
    searchQuery: '',
    setSearchQuery: jest.fn(),
  })),
}));

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

const mockSetInputValue = jest.fn();

describe('DynamicSelection', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    useDebouncedQuery.mockReturnValue({
      isLoading: false,
      options: [{ label: '11111', value: 'poLine-1' }],
      inputValue: '',
      setSearchQuery: mockSetInputValue,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call debounced fetch function when \'onFilter\' was triggered', async () => {
    renderDynamicSelection();

    const input = screen.getByLabelText('stripes-components.selection.filterOptionsLabel', { selector: 'input' });

    await act(async () => {
      await userEvent.type(input, '1');
      jest.advanceTimersByTime(1500);
    });
    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));

    expect(mockSetInputValue).toHaveBeenCalledWith('1');
  });

  it('should call \'onChange\' when an option from list was selected', async () => {
    renderDynamicSelection();

    const input = screen.getByLabelText('stripes-components.selection.filterOptionsLabel', { selector: 'input' });

    await act(async () => {
      await userEvent.type(input, '1');
      jest.advanceTimersByTime(1500);
    });

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText(/11111/));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });
});
