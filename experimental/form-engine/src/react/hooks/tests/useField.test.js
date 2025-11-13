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
} from '../../../index';

describe('useField', () => {
  it('should update value, dirty, and touched states on user interaction', async () => {
    const user = userEvent.setup();

    render(
      <Form onSubmit={() => {}} initialValues={{ name: '' }}>
        <Field name="name">
          {({ input, meta }) => (
            <div>
              <input data-testid="name" {...input} />
              <span data-testid="dirty">{String(meta.dirty)}</span>
              <span data-testid="touched">{String(meta.touched)}</span>
            </div>
          )}
        </Field>
      </Form>,
    );

    const input = screen.getByTestId('name');

    expect(screen.getByTestId('dirty').textContent).toBe('false');
    expect(screen.getByTestId('touched').textContent).toBe('false');

    await user.type(input, 'x');
    // Wait for batched dirty state update
    await waitFor(() => {
      expect(screen.getByTestId('dirty').textContent).toBe('true');
    });

    await user.tab();
    // Wait for batched touched state update
    await waitFor(() => {
      expect(screen.getByTestId('touched').textContent).toBe('true');
    });
  });

  it('should display field error when validation fails', async () => {
    const user = userEvent.setup();

    render(
      <Form
        onSubmit={() => {}}
        initialValues={{ email: '' }}
      >
        <Field
          name="email"
          validate={(value) => (!value ? 'Email is required' : null)}
          validateOn="blur"
        >
          {({ input, meta }) => (
            <div>
              <input data-testid="email" {...input} />
              <span data-testid="error">{meta.error || ''}</span>
            </div>
          )}
        </Field>
      </Form>,
    );

    const input = screen.getByTestId('email');

    // Initially no error
    expect(screen.getByTestId('error').textContent).toBe('');

    // Focus and blur without entering value - should trigger validation
    await user.click(input);
    await user.tab();

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Email is required');
    });

    // Type valid value
    await user.type(input, 'test@test.com');

    // Blur to trigger validation again
    await user.tab();

    // Wait for error to be cleared
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('');
    });
  });
});
