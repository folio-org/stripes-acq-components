import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { useUsersBatch } from '../../hooks';
import {
  useGoBack,
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import { RoutingListView } from './RoutingListView';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: jest.fn(() => 'Loading'),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
}));

jest.mock('../hooks', () => ({
  useGoBack: jest.fn().mockReturnValue(jest.fn()),
  useRoutingList: jest.fn().mockReturnValue({
    routingList: {},
    isLoading: false,
  }),
  useRoutingListMutation: jest.fn().mockReturnValue({
    createRoutingList: jest.fn(),
    deleteRoutingList: jest.fn(),
    updateRoutingList: jest.fn(),
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
  }),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => render(
  <RoutingListView routingListUrl="/orders/routing-list" />,
  { wrapper },
);

const mockRoutingList = {
  id: '1',
  notes: 'notes',
  poLineId: '1',
  name: 'name',
  userIds: ['1'],
};

describe('RoutingListView', () => {
  beforeEach(() => {
    useRoutingList.mockClear().mockReturnValue({
      routingList: mockRoutingList,
      isLoading: false,
    });
    useUsersBatch.mockClear().mockReturnValue({
      users: [{
        id: '1',
        personal: { firstName: 'Test', lastName: 'User' },
      }],
      isLoading: false,
    });
  });

  it('should render component when `useRoutingList` hook `isLoading` is false', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.name')).toBeInTheDocument();
  });

  it('should render Loading when `useRoutingList` hook is `isLoading`', () => {
    useRoutingList.mockClear().mockReturnValue({ isLoading: true, routingList: {} });

    renderComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render routingList data', () => {
    useRoutingList.mockClear().mockReturnValue({
      isLoading: false,
      routingList: mockRoutingList,
    });

    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.users')).toBeInTheDocument();
  });

  it('should delete a routing list data', async () => {
    const mockDeleteListing = jest.fn();

    useRoutingListMutation.mockClear().mockReturnValue({
      deleteRoutingList: mockDeleteListing,
    });
    useRoutingList.mockClear().mockReturnValue({
      isLoading: false,
      routingList: mockRoutingList,
    });

    renderComponent();

    user.click(screen.getByTestId('delete-routing-list'));
    await waitFor(() => screen.getByText('stripes-acq-components.routing.list.delete.confirm'));

    const confirmDelete = await screen.findByText('stripes-acq-components.routing.list.delete.confirm.label');

    expect(confirmDelete).toBeInTheDocument();
    await user.click(confirmDelete);

    expect(mockDeleteListing).toHaveBeenCalled();
  });

  it('should call `useGoBack` when click close icon', async () => {
    const mockGoBack = jest.fn();

    useRoutingList.mockClear().mockReturnValue({
      isLoading: false,
      routingList: mockRoutingList,
    });

    useGoBack.mockClear().mockReturnValue(mockGoBack);

    renderComponent();

    user.click(screen.getByLabelText('stripes-components.closeItem'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
