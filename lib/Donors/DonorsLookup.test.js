import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { DonorsLookup } from './DonorsLookup';

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
  name: 'donors',
};

const renderComponent = (props = defaultProps) => (render(
  <DonorsLookup {...props} />,
));

describe('DonorsLookup', () => {
  it('should render component', async () => {
    renderComponent();

    const addDonorsButton = screen.getByText('Add donor');

    expect(addDonorsButton).toBeDefined();

    await user.click(addDonorsButton);
    expect(mockOnAddDonors).toHaveBeenCalledWith([mockVendorData]);
  });
});
