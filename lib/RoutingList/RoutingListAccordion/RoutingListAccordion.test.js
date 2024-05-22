import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useRoutingLists } from '../hooks';
import { RoutingListAccordion } from './RoutingListAccordion';

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

const renderComponent = (props = {}) => (render(
  <RoutingListAccordion
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('RoutingListAccordion', () => {
  beforeEach(() => {
    useRoutingLists.mockClear().mockReturnValue({
      routingLists: [],
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.label')).toBeInTheDocument();
  });

  it('should render Loading', () => {
    useRoutingLists.mockClear().mockReturnValue({ isLoading: true, routingLists: [] });

    renderComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render routingList data', () => {
    useRoutingLists.mockClear().mockReturnValue({
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

  it('should render print routingList button', () => {
    useRoutingLists.mockClear().mockReturnValue({
      isLoading: false,
      routingLists: [{
        id: '1',
        notes: 'notes',
        poLineId: '1',
        userIds: ['firstName lastName'],
      }],
    });

    renderComponent({ canPrint: true });

    expect(screen.getByText('stripes-acq-components.routing.list.actions.printRoutingList')).toBeInTheDocument();
  });
});
