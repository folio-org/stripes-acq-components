import { MemoryRouter } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';

import { useRoutingLists } from '../hooks';
import { RoutingListAccordion } from './RoutingListAccordion';

jest.mock('react-to-print', () => ({
  useReactToPrint: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('../hooks', () => ({
  useRoutingLists: jest.fn().mockReturnValue({
    routingLists: [],
    isLoading: false,
  }),
}));

const defaultProps = {
  disabled: false,
  poLineId: '1',
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <RoutingListAccordion
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('RoutingListAccordion', () => {
  beforeEach(() => {
    useRoutingLists.mockReturnValue({
      routingLists: [],
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.label')).toBeInTheDocument();
  });

  it('should render Loading', () => {
    useRoutingLists.mockReturnValue({ isFetching: true, routingLists: [] });

    renderComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render routingList data', () => {
    useRoutingLists.mockReturnValue({
      isLoading: false,
      routingLists: [{
        id: '1',
        notes: 'notes',
        poLineId: '1',
        userIds: ['firstName lastName'],
      }],
    });

    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.column.name')).toBeInTheDocument();
  });

  it('should render print routingList button', async () => {
    const printMock = jest.fn();

    useReactToPrint.mockImplementation(() => printMock);
    useOkapiKy.mockReturnValue({ get: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({
      map: {
        result: {
          body: 'body',
        },
      },
    }) }) });
    useRoutingLists.mockReturnValue({
      isLoading: false,
      routingLists: [{
        id: '1',
        notes: 'notes',
        poLineId: '1',
        userIds: ['firstName lastName'],
      }],
    });

    renderComponent({ canPrint: true });

    const printButton = screen.getByTestId('routing-list-print-button');

    expect(printButton).toBeInTheDocument();

    await userEvent.click(printButton);

    await waitFor(() => expect(printMock).toHaveBeenCalled());
  });
});
