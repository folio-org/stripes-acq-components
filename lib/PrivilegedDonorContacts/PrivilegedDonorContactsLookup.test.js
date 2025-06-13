import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', async () => {
    renderComponent();

    const addDonorsButton = screen.getByText('Add donor');

    expect(addDonorsButton).toBeDefined();

    await userEvent.click(addDonorsButton);

    expect(mockOnAddContacts).toHaveBeenCalledWith([mockContactData]);
  });

  it('should render component with disabled button', () => {
    useStripes.mockReturnValueOnce({ hasPerm: () => false });

    renderComponent();

    const addDonorsButton = screen.getByText('Add donor');

    expect(addDonorsButton).toBeInTheDocument();
    expect(addDonorsButton).toBeDisabled();
  });
});
