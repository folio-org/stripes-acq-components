import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useRoutingList } from './hooks';
import { RoutingList } from './RoutingList';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('./hooks', () => ({
  useRoutingList: jest.fn().mockReturnValue({
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
  <RoutingList
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('RoutingList', () => {
  beforeEach(() => {
    useRoutingList.mockClear().mockReturnValue({
      routingLists: [],
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.label')).toBeInTheDocument();
  });

  it('should render Loading', () => {
    useRoutingList.mockClear().mockReturnValue({ isLoading: true, routingLists: [] });

    renderComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render routingList data', () => {
    useRoutingList.mockClear().mockReturnValue({
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
    useRoutingList.mockClear().mockReturnValue({
      isLoading: false,
      routingLists: [{
        id: '1',
        notes: 'notes',
        poLineId: '1',
        userIds: ['firstName lastName'],
      }],
    });

    renderComponent({ canPrint: true });

    expect(screen.getByText('ui-receiving.title.details.button.printRoutingList')).toBeInTheDocument();
  });
});
