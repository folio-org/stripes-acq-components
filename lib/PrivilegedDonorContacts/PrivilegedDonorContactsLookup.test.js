import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { useStripes } from '@folio/stripes/core';

import { PrivilegedDonorContactsLookup } from './PrivilegedDonorContactsLookup';

const mockContactData = { id: '1', name: 'Amazon' };

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn(({ children, disabled, ...rest }) => {
    return (
      <div>
        {children}
        <button
          type="button"
          id={rest?.name}
          disabled={disabled}
          onClick={() => rest?.addContacts([mockContactData])}
        >
          Add donor
        </button>
      </div>
    );
  }),
  useStripes: jest.fn(() => ({ hasPerm: () => true })),
}));

const mockOnAddContacts = jest.fn();

const defaultProps = {
  onAddContacts: mockOnAddContacts,
  name: 'donors',
};

const renderComponent = (props = defaultProps) => (render(
  <PrivilegedDonorContactsLookup {...props} />,
));

describe('PrivilegedDonorContactsLookup', () => {
  it('should render component', () => {
    renderComponent();

    const addDonorsButton = screen.getByText('Add donor');

    expect(addDonorsButton).toBeDefined();

    user.click(addDonorsButton);
    expect(mockOnAddContacts).toHaveBeenCalledWith([mockContactData]);
  });

  it('should render component with disabled button', () => {
    useStripes.mockClear().mockReturnValueOnce({ hasPerm: () => false });

    renderComponent();

    const addDonorsButton = screen.getByText('Add donor');

    expect(addDonorsButton).toBeInTheDocument();
    expect(addDonorsButton).toBeDisabled();
  });
});
