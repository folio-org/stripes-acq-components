import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import DonorsList from './DonorsList';

const mockSetDonorIds = jest.fn();

const defaultProps = {
  setDonorIds: mockSetDonorIds,
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
