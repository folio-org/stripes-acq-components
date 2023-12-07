import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import { useCategories } from '../hooks';
import { ContactsContainer } from './ContactsContainer';

const mockVendor = { id: '1', name: 'Amazon' };

jest.mock('./PrivilegedDonorContactsList', () => ({
  PrivilegedDonorContactsList: jest.fn(({ contentData }) => {
    return (
      <div>
        {contentData.map(({ name }) => (
          <div key={name}>{name}</div>
        ))}
      </div>
    );
  }),
}));

jest.mock('./PrivilegedDonorContactsLookup', () => ({
  PrivilegedDonorContactsLookup: jest.fn(({ onAddContacts }) => {
    return (
      <div>
        <button
          type="button"
          onClick={() => onAddContacts([mockVendor])}
        >
          Add donor
        </button>
      </div>
    );
  }),
}));

const setContactIds = jest.fn();

jest.mock('../hooks', () => ({
  useCategories: jest.fn().mockReturnValue({
    categories: [],
    isLoading: false,
  }),
}));

const defaultProps = {
  columnMapping: {},
  columnWidths: {},
  contacts: [],
  fields: {
    value: [
      '1',
      '2',
    ],
  },
  formatter: {},
  id: 'donors',
  setContactIds,
  searchLabel: 'Search',
  showTriggerButton: true,
  visibleColumns: ['name'],
};

const renderForm = (props = {}) => (
  <form>
    <ContactsContainer
      {...defaultProps}
      {...props}
    />
    <button type="submit">Submit</button>
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} {...props} />
  </MemoryRouter>,
));

describe('ContactsContainer', () => {
  beforeEach(() => {
    useCategories.mockClear().mockReturnValue({
      donors: [],
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('Add donor')).toBeDefined();
  });

  it('should call `setContactIds` when `onAddContacts` is called', () => {
    renderComponent({
      donors: [mockVendor],
      fields: {
        value: [],
        push: jest.fn(),
      },
    });

    const addDonorsButton = screen.getByText('Add donor');

    expect(addDonorsButton).toBeDefined();
    user.click(addDonorsButton);
    expect(setContactIds).toHaveBeenCalled();
  });

  it('should not render `DonorsLookup` when `showTriggerButton` is false', () => {
    renderComponent({ showTriggerButton: false });

    expect(screen.queryByText('Add donor')).toBeNull();
  });
});
