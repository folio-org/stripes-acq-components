import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { PrivilegedDonorContactsLookup } from './PrivilegedDonorContactsLookup';

const mockContactData = { id: '1', name: 'Amazon' };

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn(({ children, ...rest }) => {
    return (
      <div>
        {children}
        <button
          type="button"
          id={rest?.name}
          onClick={() => rest?.addContacts([mockContactData])}
        >
          Add donor
        </button>
      </div>
    );
  }),
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
});
