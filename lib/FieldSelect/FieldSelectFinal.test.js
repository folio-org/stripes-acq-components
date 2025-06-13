import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';
import { Button } from '@folio/stripes/components';

import FieldSelectFinal from './FieldSelectFinal';

// eslint-disable-next-line react/prop-types
const renderForm = ({ dataOptions, handleSubmit, required, isNonInteractive }) => (
  <form>
    <FieldSelectFinal
      data-testid="some-select"
      dataOptions={dataOptions}
      label="some label"
      name="somename"
      required={required}
      isNonInteractive={isNonInteractive}
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

    await userEvent.click(screen.getByText('Save'));

    expect(screen.getByText('stripes-acq-components.validation.required')).toBeDefined();

    await userEvent.selectOptions(screen.getByTestId('some-select'), 't1');

    expect(screen.getByDisplayValue('TEST')).toBeDefined();

    await userEvent.click(screen.getByText('Save'));

    expect(screen.queryByText('stripes-acq-components.validation.required')).toBeNull();
  });

  describe('non-interactive mode', () => {
    it('should display value label when form value is in options', () => {
      const option = { label: 'TEST', value: 't1' };
      const dataOptions = [option];

      renderComponent({ initialValues: { somename: option.value }, dataOptions, isNonInteractive: true });

      expect(screen.getByText(option.label)).toBeDefined();
    });

    it('should display field value when it is not in options', () => {
      const option = { label: 'TEST', value: 't1' };

      renderComponent({ initialValues: { somename: option.value }, dataOptions: [], isNonInteractive: true });

      expect(screen.getByText(option.value)).toBeDefined();
    });
  });
});
