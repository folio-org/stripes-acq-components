import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { PrivilegedDonorsListContainer } from './PrivilegedDonorContactsListContainer';
import { useFetchPrivilegedContacts } from './hooks';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('./PrivilegedDonorContactsList', () => ({
  PrivilegedDonorContactsList: jest.fn(() => 'PrivilegedDonorContactsList'),
}));

jest.mock('./hooks', () => ({
  useFetchPrivilegedContacts: jest.fn().mockReturnValue({
    contacts: [],
    isLoading: false,
  }),
}));

const defaultProps = {
  donorOrganizationIds: [],
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = (props = {}) => (render(
  <PrivilegedDonorsListContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('PrivilegedDonorsListContainer', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('PrivilegedDonorContactsList')).toBeDefined();
  });

  it('should render loading component', () => {
    useFetchPrivilegedContacts.mockClear().mockReturnValue({
      contacts: [],
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });
});
