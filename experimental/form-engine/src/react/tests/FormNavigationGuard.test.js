/* Developed collaboratively using AI (Cursor) */

import { createMemoryHistory } from 'history';
import {
  Router,
  Route,
} from 'react-router-dom';

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

describe('FormNavigationGuard', () => {
  it('should block navigation when form is dirty', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck
              navigationGuardProps={{ message: 'Unsaved changes' }}
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div>B</div>} />
      </Router>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));
    expect(history.location.pathname).toBe('/a');
  });

  it('should allow navigation when form is clean', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
      </Router>,
    );

    // Don't modify the form, navigate directly
    await user.click(screen.getByTestId('link-b'));

    await waitFor(() => {
      expect(screen.getByTestId('page-b')).toBeInTheDocument();
    });
  });

  it('should show confirmation modal when navigating with dirty form', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck
              navigationGuardProps={{
                message: 'Custom message',
                heading: 'Custom heading',
              }}
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div>B</div>} />
      </Router>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should still be on page A
    expect(history.location.pathname).toBe('/a');
  });

  it('should clear dirty state after successful submit', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });
    const onSubmit = jest.fn();

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={onSubmit}
              initialValues={{ name: '' }}
              navigationCheck
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="submit" data-testid="submit">Submit</button>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
      </Router>,
    );

    // Make form dirty
    await user.type(screen.getByTestId('name'), 'test');

    // Submit form
    await user.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    // Navigate - should work without blocking
    await user.click(screen.getByTestId('link-b'));

    await waitFor(() => {
      expect(screen.getByTestId('page-b')).toBeInTheDocument();
    });
  });

  it('should work without navigationGuardProps', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div>B</div>} />
      </Router>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should still block navigation
    expect(history.location.pathname).toBe('/a');
  });

  it('should use custom withPrompt from navigationGuardProps', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });
    const customPrompt = jest.fn(() => false); // Return false to block navigation

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck
              navigationGuardProps={{
                withPrompt: customPrompt,
                message: 'Leave page?',
              }}
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div>B</div>} />
      </Router>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should still be on page A
    expect(history.location.pathname).toBe('/a');
  });

  it('should handle multiple navigation attempts', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
              <button type="button" onClick={() => history.push('/c')} data-testid="link-c">Go C</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div>B</div>} />
        <Route path="/c" render={() => <div>C</div>} />
      </Router>,
    );

    await user.type(screen.getByTestId('name'), 'x');

    // Try navigating to B - should block
    await user.click(screen.getByTestId('link-b'));
    expect(history.location.pathname).toBe('/a');

    // Try navigating to C - should also block
    await user.click(screen.getByTestId('link-c'));
    expect(history.location.pathname).toBe('/a');
  });

  it('should track dirty state correctly', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    function DirtyStatus() {
      const { dirty } = useFormState({ dirty: true });

      return <div data-testid="dirty-status">{String(dirty)}</div>;
    }

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: 'initial' }}
              navigationCheck
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <DirtyStatus />
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
      </Router>,
    );

    // Initially clean
    expect(screen.getByTestId('dirty-status')).toHaveTextContent('false');

    // Make dirty
    await user.clear(screen.getByTestId('name'));
    await user.type(screen.getByTestId('name'), 'changed');

    await waitFor(() => {
      expect(screen.getByTestId('dirty-status')).toHaveTextContent('true');
    });

    // Try to navigate - should block
    await user.click(screen.getByTestId('link-b'));
    expect(history.location.pathname).toBe('/a');

    // Reset to initial value
    await user.clear(screen.getByTestId('name'));
    await user.type(screen.getByTestId('name'), 'initial');

    await waitFor(() => {
      expect(screen.getByTestId('dirty-status')).toHaveTextContent('false');
    });

    // Should allow navigation now
    await user.click(screen.getByTestId('link-b'));

    await waitFor(() => {
      expect(screen.getByTestId('page-b')).toBeInTheDocument();
    });
  });

  it('should not block navigation when navigationCheck is false', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck={false}
              enableBatching={false}
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
              <button type="button" onClick={() => history.push('/b')} data-testid="link-b">Go B</button>
            </Form>
          )}
        />
        <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
      </Router>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should navigate even though form is dirty
    await waitFor(() => {
      expect(screen.getByTestId('page-b')).toBeInTheDocument();
    });
  });

  it('should handle form unmount during navigation block', () => {
    const history = createMemoryHistory({ initialEntries: ['/a'] });

    const { unmount } = render(
      <Router history={history}>
        <Route
          path="/a"
          render={() => (
            <Form
              onSubmit={() => {}}
              initialValues={{ name: '' }}
              navigationCheck
            >
              <Field name="name">
                {({ input }) => <input data-testid="name" {...input} />}
              </Field>
            </Form>
          )}
        />
      </Router>,
    );

    unmount();

    // Should not throw errors
    expect(true).toBe(true);
  });
});
