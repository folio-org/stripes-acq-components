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
});
