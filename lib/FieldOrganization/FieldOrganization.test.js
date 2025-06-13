import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import FieldOrganization from './FieldOrganization';

const ORG = { id: '1', name: 'org 1' };

// eslint-disable-next-line react/prop-types
const renderForm = (props) => (
  <form>
    <FieldOrganization
      change={() => { }}
      labelId="labelId"
      name="org"
      {...props}
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
    await waitFor(() => expect(screen.getByText('org 1')).toBeInTheDocument());
  });

  it('should display preselected org', async () => {
    renderComponent({ mutator, initialValues: { 'org': '1' }, id: '1' });

    await waitFor(() => expect(screen.getByTestId('field-org').value).toBe('org 1'));
    await userEvent.click(screen.getByLabelText('stripes-components.clearThisField'));

    expect(screen.queryByText('org 1')).not.toBeInTheDocument();
  });
});
