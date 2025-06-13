import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';

import { buildFiltersObj } from '../AcqList/utils';
import { ORDERS_API } from '../constants';
import { DynamicSelectionFilter } from './DynamicSelectionFilter';

jest.mock('../AcqList/utils', () => ({
  ...jest.requireActual('../AcqList/utils'),
  buildFiltersObj: jest.fn(),
}));

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useDebouncedQuery: jest.fn(() => ({
    options: [{ label: '11111', value: 'poLine-1' }],
    isLoading: false,
    searchQuery: '',
    setSearchQuery: jest.fn(),
  })),
}));

jest.useFakeTimers({ advanceTimers: true });

const dataFormatter = ({ poLines }) => poLines.map(({ id, poLineNumber }) => ({ label: poLineNumber, value: id }));

const defaultProps = {
  api: ORDERS_API,
  dataFormatter,
  id: 'filter-id',
  labelId: 'labelId',
  name: 'dynamic',
  onChange: jest.fn(),
  queryBuilder: (value) => `poLineNumber==${value}`,
};

const renderDynamicSelectionFilter = (props = {}) => render(
  <DynamicSelectionFilter
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ poLines: [{ id: 'poLine-1', poLineNumber: '11111' }] }),
  })),
};

describe('DynamicSelectionFilter', () => {
  beforeEach(() => {
    buildFiltersObj.mockReturnValue({ [defaultProps.name]: ['filter'] });
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show filter input and call \'onChange\' when an option from list was selected', async () => {
    await act(async () => {
      renderDynamicSelectionFilter();
    });

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
    await userEvent.click(screen.getByText(/11111/));

    expect(defaultProps.onChange).toHaveBeenCalled();
  });
});
