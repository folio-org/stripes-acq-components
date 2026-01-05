/* Developed collaboratively using AI (Cursor) */

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  Form,
  useSubmit,
} from '../../../index';

function TestComponent({ onSubmit }) {
  const { handleSubmit } = useSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}

describe('useSubmit', () => {
  it('should handle form submission', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <Form onSubmit={onSubmit} initialValues={{ email: 'test@test.com' }}>
        <TestComponent onSubmit={onSubmit} />
      </Form>,
    );
    await user.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
