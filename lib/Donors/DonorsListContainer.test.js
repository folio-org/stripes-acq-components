import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { DonorsListContainer } from './DonorsListContainer';
import { useFetchDonors } from './hooks';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));

jest.mock('./DonorsList', () => ({
  DonorsList: jest.fn(() => 'DonorsList'),
}));

jest.mock('./hooks', () => ({
  useFetchDonors: jest.fn().mockReturnValue({
    donors: [],
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
  <DonorsListContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('DonorsListContainer', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('DonorsList')).toBeDefined();
  });

  it('should render loading component', () => {
    useFetchDonors.mockClear().mockReturnValue({
      donors: [],
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading')).toBeDefined();
  });
});
