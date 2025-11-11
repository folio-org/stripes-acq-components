/* Developed collaboratively using AI (Cursor) */

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  Field,
  Form,
  useWatch,
} from '../../../index';

function TestComponent() {
  const email = useWatch('email');

  return <div data-testid="watched">{email || ''}</div>;
}

describe('useWatch', () => {
  it('should watch field value changes', async () => {
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
    const input = screen.getByTestId('email');

    await user.type(input, 'test@test.com');
    // Wait for updates to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByTestId('watched').textContent).toBe('test@test.com');
  });

  it('should use selector function', async () => {
    const user = userEvent.setup();

    function TestComponentWithSelector() {
      const upperEmail = useWatch('email', (value) => value?.toUpperCase() || '');

      return <div data-testid="watched-upper">{upperEmail}</div>;
    }
    render(
      <Form
        onSubmit={() => {}}
        initialValues={{ email: '' }}
        enableBatching={false}
      >
        <Field name="email">
          {({ input }) => <input data-testid="email" {...input} />}
        </Field>
        <TestComponentWithSelector />
      </Form>,
    );
    const input = screen.getByTestId('email');

    await user.type(input, 'test');
    // Wait for updates to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByTestId('watched-upper').textContent).toBe('TEST');
  });
});
