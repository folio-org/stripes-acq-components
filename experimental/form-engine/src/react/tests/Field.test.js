/* Developed collaboratively using AI (Cursor) */

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  Field,
  Form,
} from '../../index';

describe('Field', () => {
  it('should render input with value', async () => {
    const user = userEvent.setup();

    render(
      <Form onSubmit={() => {}} initialValues={{ name: 'test' }}>
        <Field name="name" />
      </Form>,
    );

    // Input should have initial value after render
    const input = await screen.findByDisplayValue('test');

    expect(input).toBeInTheDocument();

    // Clear and type new value
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'testx');
      // Give batching time to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    expect(input).toHaveValue('testx');
  });

  it('should render with component prop', () => {
    const CustomInput = ({ value, onChange, ...props }) => (
      <input data-testid="custom" value={value} onChange={onChange} {...props} />
    );

    render(
      <Form onSubmit={() => {}} initialValues={{ name: 'test' }}>
        <Field name="name" component={CustomInput} />
      </Form>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('should render with children render prop', () => {
    render(
      <Form onSubmit={() => {}} initialValues={{ name: 'test' }}>
        <Field name="name">
          {({ input, meta }) => (
            <div>
              <input data-testid="name" {...input} />
              <span data-testid="error">{meta.error}</span>
            </div>
          )}
        </Field>
      </Form>,
    );
    expect(screen.getByTestId('name')).toBeInTheDocument();
  });

  it('should format value', async () => {
    render(
      <Form onSubmit={() => {}} initialValues={{ phone: '1234567890' }}>
        <Field
          name="phone"
          format={(value) => value?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
        />
      </Form>,
    );
    // Format should be applied to initial value
    const input = await screen.findByDisplayValue('(123) 456-7890');

    expect(input).toBeInTheDocument();
  });
});
