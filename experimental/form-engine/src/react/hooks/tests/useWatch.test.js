/* Developed collaboratively using AI (Cursor) */

import {
  render,
  screen,
  waitFor,
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
      <Form onSubmit={() => {}} initialValues={{ email: '' }}>
        <Field name="email">
          {({ input }) => <input data-testid="email" {...input} />}
        </Field>
        <TestComponent />
      </Form>
    );
    await user.type(screen.getByTestId('email'), 'test@test.com');
    await waitFor(() => {
      expect(screen.getByTestId('watched').textContent).toBe('test@test.com');
    });
  });

  it('should use selector function', async () => {
    const user = userEvent.setup();
    function TestComponentWithSelector() {
      const upperEmail = useWatch('email', (value) => value?.toUpperCase() || '');
      return <div data-testid="watched-upper">{upperEmail}</div>;
    }
    render(
      <Form onSubmit={() => {}} initialValues={{ email: '' }}>
        <Field name="email">
          {({ input }) => <input data-testid="email" {...input} />}
        </Field>
        <TestComponentWithSelector />
      </Form>
    );
    await user.type(screen.getByTestId('email'), 'test');
    await waitFor(() => {
      expect(screen.getByTestId('watched-upper').textContent).toBe('TEST');
    });
  });
});

