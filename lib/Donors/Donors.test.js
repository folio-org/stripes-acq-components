import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { Donors } from './Donors';
import { useFetchDonors } from './hooks';

jest.mock('./DonorsLookup', () => ({
  DonorsLookup: jest.fn(({ onAddDonors }) => (
    <button
      type="button"
      onClick={() => onAddDonors([{ id: 'donorId' }])}
    >
      Add donor
    </button>
  )),
}));

jest.mock('./hooks', () => ({
  useFetchDonors: jest.fn().mockReturnValue({
    donors: [],
    isLoading: false,
  }),
}));

const defaultProps = {
  name: 'donors',
  donorOrganizationIds: [],
  onChange: jest.fn(),
};

const renderForm = (props = {}) => (
  <form>
    <Donors
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

describe('Donors', () => {
  beforeEach(() => {
    useFetchDonors.mockClear().mockReturnValue({
      donors: [],
      isLoading: false,
    });
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-components.tableEmpty')).toBeDefined();
  });

  it('should call onChange when donorOrganizationIds changed', async () => {
    const onChange = jest.fn();

    renderComponent({ onChange });

    const addDonorButton = screen.getByText('Add donor');

    await userEvent.click(addDonorButton);

    expect(onChange).toHaveBeenCalled();
  });
});
