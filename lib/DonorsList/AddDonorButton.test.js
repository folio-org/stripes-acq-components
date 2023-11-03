import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import AddDonorButton from './AddDonorButton';

const mockVendorData = { id: '1', name: 'Amazon' };

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn(({ children, ...rest }) => {
    return (
      <div>
        {children}
        <button
          type="button"
          id={rest?.name}
          onClick={() => rest?.selectVendor([mockVendorData])}
        >
          Add donor
        </button>
      </div>
    );
  }),
}));

const mockOnAddDonors = jest.fn();

const defaultProps = {
  onAddDonors: mockOnAddDonors,
  fields: {
    name: 'donors',
  },
  name: 'donors',
};

const renderComponent = (props = defaultProps) => (render(
  <AddDonorButton {...props} />,
));

describe('AddDonorButton', () => {
  it('should render component', async () => {
    renderComponent({
      fields: {
        name: 'donors',
        push: jest.fn(),
      },
      name: 'donors',
      onAddDonors: mockOnAddDonors,
    });

    const addDonorsButton = screen.getByText('Add donor');

    expect(addDonorsButton).toBeDefined();

    await user.click(addDonorsButton);

    expect(mockOnAddDonors).toHaveBeenCalledWith([mockVendorData.id]);
  });
});
