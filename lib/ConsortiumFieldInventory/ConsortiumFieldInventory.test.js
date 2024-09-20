import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import {
  location,
  tenants,
} from '../../test/jest/fixtures';
import { StripesFinalFormHelper } from '../../test/jest/helpers';
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

const renderConsortiumFieldInventory = (props = {}) => render(
  <StripesFinalFormHelper
    onSubmit={jest.fn()}
    initialValues={{}}
  >
    <ConsortiumFieldInventory
      {...defaultProps}
      {...props}
    />
  </StripesFinalFormHelper>,
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

    await userEvent.click(screen.getAllByText('stripes-components.selection.controlLabel')[0]);
    await userEvent.click(screen.getByText(tenants[1].name));

    expect(onAffiliationChange).toHaveBeenCalled();
  });
});
