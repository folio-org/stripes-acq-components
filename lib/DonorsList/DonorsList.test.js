import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import DonorsList from './DonorsList';

const mockFetchDonors = jest.fn();

const defaultProps = {
  fetchDonors: mockFetchDonors,
  fields: {},
  donorsMap: {},
  id: 'donors',
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = (props = {}) => (render(
  <DonorsList
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('DonorsList', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.tableEmpty')).toBeDefined();
  });

  it('should render the list of donor organizations', () => {
    renderComponent({
      fields: {
        value: [
          '1',
          '2',
        ],
      },
      donorsMap: {
        1: { id: '1', name: 'Amazon' },
        2: { id: '2', name: 'Google' },
      },
    });

    expect(screen.getByText('Amazon')).toBeDefined();
    expect(screen.getByText('Google')).toBeDefined();
  });
});
