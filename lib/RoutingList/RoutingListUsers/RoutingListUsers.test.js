import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { useUsersBatch } from '../../hooks';
import { RoutingListUsers } from './RoutingListUsers';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <RoutingListUsers
    editable
    onAddUsers={jest.fn()}
    ids={['1']}
    {...props}
  />,
  { wrapper },
);

describe('RoutingListUsers', () => {
  it('should render component when `useUsersBatch` hook `isLoading` is false', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.addUsers.plugin.notAvailable')).toBeInTheDocument();
  });

  it('should render Loading component when `useUsersBatch` hook `isLoading` is true', () => {
    useUsersBatch.mockClear().mockReturnValue({ isLoading: true, users: [] });

    renderComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should delete the user on click `x` icon', async () => {
    const mockOnAddUsers = jest.fn();

    useUsersBatch.mockClear().mockReturnValue({
      isLoading: false,
      users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    });

    const { container } = renderComponent({ onAddUsers: mockOnAddUsers });

    await user.click(container.querySelector('#clickable-remove-user-1'));

    expect(mockOnAddUsers).toHaveBeenCalled();
  });

  it('should not render add users button if `editable` is false', () => {
    renderComponent({ editable: false });

    expect(screen.queryByText('stripes-acq-components.routing.list.addUsers')).not.toBeInTheDocument();
  });
});
