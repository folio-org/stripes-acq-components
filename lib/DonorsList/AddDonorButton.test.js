import { render, screen } from '@testing-library/react';

import AddDonorButton from './AddDonorButton';

const mockOnAddDonors = jest.fn();

const defaultProps = {
  onAddDonors: mockOnAddDonors,
  fields: {},
  stripes: {},
  name: 'donors',
};

const renderComponent = (props = {}) => (render(
  <AddDonorButton
    {...defaultProps}
    {...props}
  />,
));

describe('AddDonorButton', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.donors.noFindOrganizationPlugin')).toBeDefined();
  });
});
