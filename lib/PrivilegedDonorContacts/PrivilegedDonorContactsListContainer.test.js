import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('PrivilegedDonorContactsList')).toBeInTheDocument();
  });

  it('should render loading component', () => {
    useFetchPrivilegedContacts.mockReturnValue({
      contacts: [],
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
