import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';

import { tenants } from 'fixtures';
import { FieldAffiliation } from './FieldAffiliation';

const defaultProps = {
  name: 'tenantId',
  dataOptions: tenants.map(({ id, name }) => ({ label: name, value: id })),
};

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const renderFieldAffiliation = (props = {}) => render(
  <Form
    onSubmit={jest.fn()}
    initialValues={{}}
  >
    <FieldAffiliation
      {...defaultProps}
      {...props}
    />
  </Form>,
  { wrapper: MemoryRouter },
);

describe('FieldAffiliation', () => {
  it('should render affiliation field', () => {
    renderFieldAffiliation();

    expect(screen.getByText(/affiliations.select.label/)).toBeInTheDocument();
  });
});
