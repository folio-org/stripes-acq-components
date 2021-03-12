import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';
import { Button } from '@folio/stripes/components';

import FieldSelectFinal from './FieldSelectFinal';

// eslint-disable-next-line react/prop-types
const renderForm = ({ dataOptions, handleSubmit, required }) => (
  <form>
    <FieldSelectFinal
      data-testid="some-select"
      dataOptions={dataOptions}
      label="some label"
      name="somename"
      required={required}
    />
    <Button
      data-testid="submit"
      // eslint-disable-next-line react/prop-types
      onClick={handleSubmit}
    >
      Save
    </Button>
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} {...props} />
  </MemoryRouter>,
));

describe('FieldSelectFinal', () => {
  it('renders input', () => {
    renderComponent();
    expect(screen.queryByText('stripes-acq-components.validation.required')).toBeNull();
    expect(screen.getByText('some label')).toBeDefined();
  });

  it('should display required message', async () => {
    const dataOptions = [{ label: 'TEST', value: 't1' }];
    const onSubmit = jest.fn();

    renderComponent({ initialValues: { somename: '' }, dataOptions, required: true, onSubmit });
    expect(screen.queryByDisplayValue('TEST')).toBeNull();
    user.click(screen.getByText('Save'));
    expect(screen.getByText('stripes-acq-components.validation.required')).toBeDefined();
    user.selectOptions(screen.getByTestId('some-select'), 't1');
    expect(screen.getByDisplayValue('TEST')).toBeDefined();
    user.click(screen.getByText('Save'));
    expect(screen.queryByText('stripes-acq-components.validation.required')).toBeNull();
  });
});
