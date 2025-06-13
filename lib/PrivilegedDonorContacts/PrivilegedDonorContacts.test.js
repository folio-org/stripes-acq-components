import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { useFetchPrivilegedContacts } from './hooks';
import { PrivilegedDonorContacts } from './PrivilegedDonorContacts';

jest.mock('../hooks', () => ({
  useCategories: jest.fn().mockReturnValue({ categories: [] }),
}));

jest.mock('./hooks', () => ({
  useFetchPrivilegedContacts: jest.fn(),
}));

jest.mock('./PrivilegedDonorContactsLookup', () => ({
  PrivilegedDonorContactsLookup: jest.fn(({ onAddContacts }) => (
    <button
      type="button"
      onClick={() => onAddContacts([{ id: 'donorId' }])}
    >
      Add donor
    </button>
  )),
}));

const mockOnChange = jest.fn();

const renderForm = (props = {}) => (
  <form>
    <PrivilegedDonorContacts
      name="privilegedDonorContacts"
      privilegedContactIds={['1']}
      onChange={mockOnChange}
      contacts={[]}
      fields={{ value: [], push: jest.fn() }}
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

describe('PrivilegedDonorContacts', () => {
  beforeEach(() => {
    useFetchPrivilegedContacts.mockReturnValue({
      contacts: [],
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.tableEmpty')).toBeDefined();
  });

  it('should call onChange when contactIds changed', async () => {
    const onChange = jest.fn();

    renderComponent({ onChange });

    const addDonorButton = screen.getByText('Add donor');

    await userEvent.click(addDonorButton);

    expect(onChange).toHaveBeenCalled();
  });
});
