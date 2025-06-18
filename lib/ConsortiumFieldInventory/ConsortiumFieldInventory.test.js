import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useStripes } from '@folio/stripes/core';

import {
  location,
  tenants,
} from '../../test/jest/fixtures';
import { StripesFinalFormHelper } from '../../test/jest/helpers';
import { useConsortiumTenants } from '../hooks';
import { ConsortiumFieldInventory } from './ConsortiumFieldInventory';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useConsortiumTenants: jest.fn(),
}));

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
const additionalAffiliation = {
  id: 'college',
  name: 'College',
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

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
  { wrapper },
);

describe('ConsortiumFieldInventory', () => {
  beforeEach(() => {
    useStripes
      .mockClear()
      .mockReturnValue(stripes);
    useConsortiumTenants
      .mockReturnValue({
        tenants: [...tenants, additionalAffiliation],
      });
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

  it('should render affiliations with additionalAffiliationIds', async () => {
    renderConsortiumFieldInventory({
      additionalAffiliationIds: [additionalAffiliation.id],
    });

    await userEvent.click(screen.getAllByText('stripes-components.selection.controlLabel')[0]);

    expect(await screen.findByText(additionalAffiliation.name)).toBeInTheDocument();
  });
});
