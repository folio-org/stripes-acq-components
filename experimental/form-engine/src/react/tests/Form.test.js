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
  useFormState,
} from '../../index';

function Debug() {
  const { dirty, pristine, submitSucceeded } = useFormState({ dirty: true, pristine: true, submitSucceeded: true });
  return (
    <div>
      <div data-testid="dirty">{String(dirty)}</div>
      <div data-testid="pristine">{String(pristine)}</div>
      <div data-testid="submitSucceeded">{String(submitSucceeded)}</div>
    </div>
  );
}

describe('Form', () => {
  it('should toggle submitSucceeded on submit and reset on change', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit} initialValues={{ email: '' }}>
        <Field name="email">
          {({ input }) => <input data-testid="email" {...input} />}
        </Field>
        <Debug />
        <button type="submit">Submit</button>
      </Form>
    );

    await user.type(screen.getByTestId('email'), 'a@b');
    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('submitSucceeded').textContent).toBe('true');
    });

    await user.type(screen.getByTestId('email'), 'c@d');
    await waitFor(() => {
      expect(screen.getByTestId('submitSucceeded').textContent).toBe('false');
    });
  });
});
