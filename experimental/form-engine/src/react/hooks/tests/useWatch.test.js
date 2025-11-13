/* Developed collaboratively using AI (Cursor) */

import React from 'react';
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
      const upperEmail = useWatch('email', { selector: (value) => value?.toUpperCase() || '' });

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

  describe('Bubble events', () => {
    it('should watch parent path changes when bubble is enabled', async () => {
      const user = userEvent.setup();

      function WatchParent() {
        const userData = useWatch('user', { bubble: true });

        return <div data-testid="watched-user">{JSON.stringify(userData)}</div>;
      }

      render(
        <Form
          onSubmit={() => {}}
          initialValues={{ user: { name: '', email: '' } }}
          enableBatching={false}
        >
          <Field name="user.name">
            {({ input }) => <input data-testid="user-name" {...input} />}
          </Field>
          <Field name="user.email">
            {({ input }) => <input data-testid="user-email" {...input} />}
          </Field>
          <WatchParent />
        </Form>,
      );

      await user.type(screen.getByTestId('user-name'), 'John');

      await waitFor(() => {
        const watchedText = screen.getByTestId('watched-user').textContent;
        const parsed = JSON.parse(watchedText);

        expect(parsed.name).toBe('John');
      });
    });

    it('should not watch parent path changes when bubble is disabled', async () => {
      const user = userEvent.setup();

      function WatchParentNoBubble() {
        const userData = useWatch('user'); // No bubble option

        return <div data-testid="watched-user">{JSON.stringify(userData)}</div>;
      }

      render(
        <Form
          onSubmit={() => {}}
          initialValues={{ user: { name: '', email: '' } }}
          enableBatching={false}
        >
          <Field name="user.name">
            {({ input }) => <input data-testid="user-name" {...input} />}
          </Field>
          <WatchParentNoBubble />
        </Form>,
      );

      const initialValue = screen.getByTestId('watched-user').textContent;

      await user.type(screen.getByTestId('user-name'), 'John');

      // Wait a bit to ensure no update happens
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should not have changed (no bubble)
      expect(screen.getByTestId('watched-user').textContent).toBe(initialValue);
    });
  });

  describe('Nested paths', () => {
    it('should watch deeply nested paths', async () => {
      const user = userEvent.setup();

      function WatchNested() {
        const city = useWatch('user.address.city');

        return <div data-testid="watched-city">{city || ''}</div>;
      }

      render(
        <Form
          onSubmit={() => {}}
          initialValues={{ user: { address: { city: '' } } }}
          enableBatching={false}
        >
          <Field name="user.address.city">
            {({ input }) => <input data-testid="city" {...input} />}
          </Field>
          <WatchNested />
        </Form>,
      );

      await user.type(screen.getByTestId('city'), 'NYC');

      await waitFor(() => {
        expect(screen.getByTestId('watched-city')).toHaveTextContent('NYC');
      });
    });
  });

  describe('Array paths', () => {
    it('should watch array element changes', async () => {
      const user = userEvent.setup();

      function WatchArrayItem() {
        const item = useWatch('items[0]');

        return <div data-testid="watched-item">{item || ''}</div>;
      }

      render(
        <Form
          onSubmit={() => {}}
          initialValues={{ items: ['', ''] }}
          enableBatching={false}
        >
          <Field name="items[0]">
            {({ input }) => <input data-testid="item-0" {...input} />}
          </Field>
          <WatchArrayItem />
        </Form>,
      );

      await user.type(screen.getByTestId('item-0'), 'first');

      await waitFor(() => {
        expect(screen.getByTestId('watched-item')).toHaveTextContent('first');
      });
    });

    it('should watch entire array with bubble', async () => {
      const user = userEvent.setup();

      function WatchArray() {
        const items = useWatch('items', { bubble: true });

        return <div data-testid="watched-items">{JSON.stringify(items)}</div>;
      }

      render(
        <Form
          onSubmit={() => {}}
          initialValues={{ items: ['a', 'b'] }}
          enableBatching={false}
        >
          <Field name="items[0]">
            {({ input }) => <input data-testid="item-0" {...input} />}
          </Field>
          <WatchArray />
        </Form>,
      );

      await user.clear(screen.getByTestId('item-0'));
      await user.type(screen.getByTestId('item-0'), 'x');

      await waitFor(() => {
        const watched = JSON.parse(screen.getByTestId('watched-items').textContent);

        expect(watched[0]).toBe('x');
      });
    });
  });

  describe('Multiple watchers', () => {
    it('should support multiple watchers on same field', async () => {
      const user = userEvent.setup();

      function WatcherA() {
        const value = useWatch('name');

        return <div data-testid="watcher-a">{value || ''}</div>;
      }

      function WatcherB() {
        const value = useWatch('name');

        return <div data-testid="watcher-b">{value || ''}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <WatcherA />
          <WatcherB />
        </Form>,
      );

      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('watcher-a')).toHaveTextContent('test');
        expect(screen.getByTestId('watcher-b')).toHaveTextContent('test');
      });
    });

    it('should support different selectors on same field', async () => {
      const user = userEvent.setup();

      function LengthWatcher() {
        const length = useWatch('name', { selector: (v) => (v ? v.length : 0) });

        return <div data-testid="length">{length}</div>;
      }

      function UpperWatcher() {
        const upper = useWatch('name', { selector: (v) => (v ? v.toUpperCase() : '') });

        return <div data-testid="upper">{upper}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <LengthWatcher />
          <UpperWatcher />
        </Form>,
      );

      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('length')).toHaveTextContent('4');
        expect(screen.getByTestId('upper')).toHaveTextContent('TEST');
      });
    });
  });

  describe('Selector edge cases', () => {
    it('should handle selector returning same value', async () => {
      const user = userEvent.setup();
      const renderCount = { current: 0 };

      function WatchWithConstantSelector() {
        const value = useWatch('name', { selector: () => 'constant' });

        renderCount.current += 1;

        return <div data-testid="value">{value}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <WatchWithConstantSelector />
        </Form>,
      );

      const initialRenderCount = renderCount.current;

      await user.type(screen.getByTestId('name'), 'test');

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should not re-render because selector always returns same value
      expect(renderCount.current).toBe(initialRenderCount);
    });

    it('should handle selector with complex logic', async () => {
      const user = userEvent.setup();

      function ValidationStatusWatcher() {
        const status = useWatch('email', {
          selector: (value) => {
            if (!value) return 'empty';
            if (value.includes('@')) return 'valid';

            return 'invalid';
          },
        });

        return <div data-testid="status">{status}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ email: '' }} enableBatching={false}>
          <Field name="email">
            {({ input }) => <input data-testid="email" {...input} />}
          </Field>
          <ValidationStatusWatcher />
        </Form>,
      );

      expect(screen.getByTestId('status')).toHaveTextContent('empty');

      await user.type(screen.getByTestId('email'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('invalid');
      });

      await user.type(screen.getByTestId('email'), '@example.com');

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('valid');
      });
    });
  });

  describe('Unmount cleanup', () => {
    it('should cleanup listener on unmount', async () => {
      const user = userEvent.setup();

      function ConditionalWatcher({ show }) {
        const value = useWatch('name');

        if (!show) return null;

        return <div data-testid="watcher">{value || ''}</div>;
      }

      function TestApp() {
        const [show, setShow] = React.useState(true);

        return (
          <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
            <Field name="name">
              {({ input }) => <input data-testid="name" {...input} />}
            </Field>
            <button type="button" onClick={() => setShow(!show)} data-testid="toggle">
              Toggle
            </button>
            <ConditionalWatcher show={show} />
          </Form>
        );
      }

      render(<TestApp />);

      expect(screen.getByTestId('watcher')).toBeInTheDocument();

      await user.click(screen.getByTestId('toggle'));

      expect(screen.queryByTestId('watcher')).not.toBeInTheDocument();

      // Type after unmount - should not cause errors
      await user.type(screen.getByTestId('name'), 'test');

      expect(screen.queryByTestId('watcher')).not.toBeInTheDocument();
    });
  });

  describe('Initial values', () => {
    it('should return initial value immediately', () => {
      function WatchInitial() {
        const name = useWatch('name');

        return <div data-testid="watched">{name}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: 'initial' }}>
          <WatchInitial />
        </Form>,
      );

      expect(screen.getByTestId('watched')).toHaveTextContent('initial');
    });

    it('should handle undefined initial value', () => {
      function WatchUndefined() {
        const name = useWatch('name');

        return <div data-testid="watched">{name || 'empty'}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{}}>
          <WatchUndefined />
        </Form>,
      );

      expect(screen.getByTestId('watched')).toHaveTextContent('empty');
    });
  });
});
