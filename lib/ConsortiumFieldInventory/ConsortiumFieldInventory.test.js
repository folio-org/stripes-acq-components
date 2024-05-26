import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  location,
  tenants,
} from '../../test/jest/fixtures';
import { ConsortiumFieldInventory } from './ConsortiumFieldInventory';

const stripes = {
  user: {
    user: { tenants },
  },
};

const defaultProps = {
  affiliationName: 'tenantId',
  holdingName: 'holdingId',
  locationName: 'locationId',
  locationIds: [location.id],
  locations: [location],
};

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const renderConsortiumFieldInventory = (props = {}) => render(
  <Form
    onSubmit={jest.fn()}
    initialValues={{}}
  >
    <ConsortiumFieldInventory
      {...defaultProps}
      {...props}
    />
  </Form>,
  { wrapper: MemoryRouter },
);

describe('ConsortiumFieldInventory', () => {
  beforeEach(() => {
    useStripes
      .mockClear()
      .mockReturnValue(stripes);
  });

  it('should render affiliation field', () => {
    renderConsortiumFieldInventory();

    expect(screen.getByText(/affiliations.select.label/)).toBeInTheDocument();
  });

  it('should handle selected affiliation change', async () => {
    const onAffiliationChange = jest.fn();

    renderConsortiumFieldInventory({ onAffiliationChange });

    await userEvent.click(screen.getByText(tenants[1].name));

    expect(onAffiliationChange).toHaveBeenCalled();
  });
});
