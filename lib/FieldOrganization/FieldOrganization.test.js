import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import FieldOrganization from './FieldOrganization';

const ORG = { id: '1', name: 'org 1' };

// eslint-disable-next-line react/prop-types
const renderForm = ({ isNonInteractive, id }) => (
  <form>
    <FieldOrganization
      change={() => { }}
      id={id}  // org id
      isNonInteractive={isNonInteractive}
      labelId="labelId"
      name="org"
    />
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} initialValues={{}} {...props} />
  </MemoryRouter>,
));

describe('FieldOrganization', () => {
  const mutator = {
    fieldOrganizationOrg: {
      GET: jest.fn().mockResolvedValue(ORG),
      reset: jest.fn(),
    },
  };

  it('should show org name in non-interactive mode', async () => {
    renderComponent({ isNonInteractive: true, mutator, id: '1' });
    await waitFor(() => expect(screen.getByText('org 1')).toBeDefined());
  });

  it('should display preselected org', async () => {
    renderComponent({ mutator, initialValues: { 'org': '1' }, id: '1' });

    await waitFor(() => expect(screen.getByTestId('field-org').value).toBe('org 1'));
    user.click(screen.getByLabelText('stripes-components.clearThisField'));
    expect(screen.queryByText('org 1')).toBeNull();
  });
});
