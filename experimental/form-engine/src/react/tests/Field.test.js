/* Developed collaboratively using AI (Cursor) */

import {
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
      </Form>
    );
    const input = screen.getByDisplayValue('test');
    expect(input).toBeInTheDocument();
    await user.type(input, 'x');
    expect(input.value).toBe('testx');
  });

  it('should render with component prop', () => {
    const CustomInput = ({ value, onChange, ...props }) => (
      <input data-testid="custom" value={value} onChange={onChange} {...props} />
    );
    render(
      <Form onSubmit={() => {}} initialValues={{ name: 'test' }}>
        <Field name="name" component={CustomInput} />
      </Form>
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
      </Form>
    );
    expect(screen.getByTestId('name')).toBeInTheDocument();
  });

  it('should format value', () => {
    render(
      <Form onSubmit={() => {}} initialValues={{ phone: '1234567890' }}>
        <Field
          name="phone"
          format={(value) => value?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
        />
      </Form>
    );
    const input = screen.getByDisplayValue('(123) 456-7890');
    expect(input).toBeInTheDocument();
  });
});

