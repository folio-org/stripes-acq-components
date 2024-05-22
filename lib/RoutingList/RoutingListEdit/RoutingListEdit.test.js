import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { useShowCallout } from '../../hooks';

import { UNIQUE_NAME_ERROR_CODE } from '../constants';
import {
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import { RoutingListEdit } from './RoutingListEdit';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: jest.fn(() => 'Loading'),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useShowCallout: jest.fn(),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
}));

const mockUpdateList = jest.fn();
const mockDeleteList = jest.fn();

jest.mock('../hooks', () => ({
  useGoBack: jest.fn(),
  useRoutingList: jest.fn().mockReturnValue({
    routingList: {},
    isLoading: false,
  }),
  useRoutingListMutation: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => render(
  <RoutingListEdit />,
  { wrapper },
);

describe('RoutingListEdit', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    useRoutingList.mockClear().mockReturnValue({
      routingList: {
        id: '1',
        name: 'test',
        userIds: ['1'],
      },
      isLoading: false,
    });
    useRoutingListMutation.mockClear().mockReturnValue({
      deleteRoutingList: mockDeleteList,
      updateRoutingList: mockUpdateList,
      isDeleting: false,
      isUpdating: false,
    });
    showCalloutMock.mockClear();
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
  });

  it('should render component when `useRoutingList` hook `isLoading` is false', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.name')).toBeDefined();
  });

  it('should render Loading component when `useRoutingList` hook `isLoading` is true', () => {
    useRoutingList.mockClear().mockReturnValue({ isLoading: true, routingList: {} });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('should update routing list name', async () => {
    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'stripes-acq-components.routing.list.name' });

    await user.type(nameInput, 'edit');

    const saveBtn = screen.getByRole('button', { name: 'stripes-acq-components.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    expect(mockUpdateList).toHaveBeenCalled();
  });

  it('should return error message when create routing list failed', async () => {
    let updateRoutingListOptions = {};
    const updateRoutingList = jest.fn().mockImplementation((_, options) => {
      updateRoutingListOptions = options;
    });

    useRoutingListMutation.mockClear().mockReturnValue({
      updateRoutingList,
    });

    useRoutingList.mockClear().mockReturnValue({
      routingList: {},
      isLoading: false,
    });

    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'stripes-acq-components.routing.list.name' });

    await user.type(nameInput, 'test 2');

    const saveBtn = screen.getByRole('button', { name: 'stripes-acq-components.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await user.click(saveBtn);

    updateRoutingListOptions.onError({
      response: {
        json: jest.fn().mockResolvedValue({
          errors: [{ code: UNIQUE_NAME_ERROR_CODE }],
        }),
      },
    });

    expect(updateRoutingList).toHaveBeenCalled();
  });
});
