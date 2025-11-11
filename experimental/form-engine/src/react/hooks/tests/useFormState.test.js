/* Developed collaboratively using AI (Cursor) */

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  Field,
  Form,
  useFormState,
} from '../../../index';

function TestComponent() {
  const { values, dirty, valid } = useFormState({ values: true, dirty: true, valid: true });

  return (
    <div>
      <div data-testid="dirty">{String(dirty)}</div>
      <div data-testid="valid">{String(valid)}</div>
      <div data-testid="email-value">{values.email || ''}</div>
    </div>
  );
}

describe('useFormState', () => {
  it('should subscribe to form state changes', async () => {
    const user = userEvent.setup();

    render(
      <Form
        onSubmit={() => {}}
        initialValues={{ email: '' }}
        enableBatching={false}
      >
        <Field name="email">
          {({ input }) => <input data-testid="email" {...input} />}
        </Field>
        <TestComponent />
      </Form>,
    );
    // Type without delay
    await user.type(screen.getByTestId('email'), 'test@test.com');
    // Wait for updates to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByTestId('email-value').textContent).toBe('test@test.com');
  });
});
