import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import AddDonorButton from './AddDonorButton';

const mockOnAddDonors = jest.fn();

const defaultProps = {
  onAddDonors: mockOnAddDonors,
  fields: {},
  stripes: {},
  name: 'donors',
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = (props = {}) => (render(
  <AddDonorButton
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('AddDonorButton', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.donors.noFindOrganizationPlugin')).toBeDefined();
  });
});
