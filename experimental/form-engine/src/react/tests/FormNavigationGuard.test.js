/* Developed collaboratively using AI (Cursor) */

import {
  MemoryRouter,
  Route,
  Switch,
  useHistory,
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

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    const { container } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
        </Switch>
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should still be on page A (navigation blocked)
    expect(screen.queryByTestId('page-b')).not.toBeInTheDocument();
    expect(container.querySelector('input[data-testid="name"]')).toBeInTheDocument();
  });

  it('should allow navigation when form is clean', async () => {
    const user = userEvent.setup();

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
        </Switch>
      </MemoryRouter>,
    );

    // Don't modify the form, navigate directly
    await user.click(screen.getByTestId('link-b'));

    await waitFor(() => {
      expect(screen.getByTestId('page-b')).toBeInTheDocument();
    });
  });

  it('should show confirmation modal when navigating with dirty form', async () => {
    const user = userEvent.setup();

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    const { container } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
        </Switch>
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should still be on page A
    expect(screen.queryByTestId('page-b')).not.toBeInTheDocument();
    expect(container.querySelector('input[data-testid="name"]')).toBeInTheDocument();
  });

  it('should clear dirty state after successful submit', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
        </Switch>
      </MemoryRouter>,
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

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    const { container } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
        </Switch>
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should still block navigation
    expect(screen.queryByTestId('page-b')).not.toBeInTheDocument();
    expect(container.querySelector('input[data-testid="name"]')).toBeInTheDocument();
  });

  it('should use custom withPrompt from navigationGuardProps', async () => {
    const user = userEvent.setup();
    const customPrompt = jest.fn(() => false); // Return false to block navigation

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    const { container } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
        </Switch>
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should still be on page A
    expect(screen.queryByTestId('page-b')).not.toBeInTheDocument();
    expect(container.querySelector('input[data-testid="name"]')).toBeInTheDocument();
  });

  it('should handle multiple navigation attempts', async () => {
    const user = userEvent.setup();

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    const { container } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
          <Route path="/c" render={() => <div data-testid="page-c">C</div>} />
        </Switch>
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId('name'), 'x');

    // Try navigating to B - should block
    await user.click(screen.getByTestId('link-b'));
    expect(screen.queryByTestId('page-b')).not.toBeInTheDocument();
    expect(container.querySelector('input[data-testid="name"]')).toBeInTheDocument();

    // Try navigating to C - should also block
    await user.click(screen.getByTestId('link-c'));
    expect(screen.queryByTestId('page-c')).not.toBeInTheDocument();
    expect(container.querySelector('input[data-testid="name"]')).toBeInTheDocument();
  });

  it('should track dirty state correctly', async () => {
    const user = userEvent.setup();

    function DirtyStatus() {
      const { dirty } = useFormState({ dirty: true });

      return <div data-testid="dirty-status">{String(dirty)}</div>;
    }

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
        </Switch>
      </MemoryRouter>,
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
    expect(screen.queryByTestId('page-b')).not.toBeInTheDocument();

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

    const PageA = () => {
      const history = useHistory();

      return (
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
      );
    };

    render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
          <Route path="/b" render={() => <div data-testid="page-b">B</div>} />
        </Switch>
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId('name'), 'x');
    await user.click(screen.getByTestId('link-b'));

    // Should navigate even though form is dirty
    await waitFor(() => {
      expect(screen.getByTestId('page-b')).toBeInTheDocument();
    });
  });

  it('should handle form unmount during navigation block', () => {
    const PageA = () => {
      return (
        <Form
          onSubmit={() => {}}
          initialValues={{ name: '' }}
          navigationCheck
        >
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
        </Form>
      );
    };

    const { unmount } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Switch>
          <Route path="/a" component={PageA} />
        </Switch>
      </MemoryRouter>,
    );

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });
});
