/* Developed collaboratively using AI (Cursor) */

import { useState } from 'react';

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

  describe('Selective subscriptions', () => {
    it('should only subscribe to requested states', async () => {
      const user = userEvent.setup();

      function DirtyOnly() {
        const { dirty } = useFormState({ dirty: true });

        return <div data-testid="dirty-only">{String(dirty)}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <DirtyOnly />
        </Form>,
      );

      expect(screen.getByTestId('dirty-only')).toHaveTextContent('false');

      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('dirty-only')).toHaveTextContent('true');
      });
    });

    it('should track pristine state', async () => {
      const user = userEvent.setup();

      function PristineTracker() {
        const { pristine } = useFormState({ pristine: true });

        return <div data-testid="pristine">{String(pristine)}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <PristineTracker />
        </Form>,
      );

      expect(screen.getByTestId('pristine')).toHaveTextContent('true');

      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('pristine')).toHaveTextContent('false');
      });
    });

    it('should track valid going from true to false when a required field is cleared', async () => {
      const user = userEvent.setup();

      function ValidTracker() {
        const { valid } = useFormState({ valid: true });

        return <div data-testid="valid">{String(valid)}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: 'initial' }} enableBatching={false}>
          <Field
            name="name"
            validate={(value) => (!value ? 'Required' : null)}
            validateOn="change"
          >
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <ValidTracker />
        </Form>,
      );

      // Starts valid because initialValues has a value
      expect(screen.getByTestId('valid')).toHaveTextContent('true');

      // Select all text and delete it to clear the field
      await user.tripleClick(screen.getByTestId('name'));
      await user.keyboard('{Backspace}');

      // Validation runs on change — valid should flip to false
      await waitFor(() => {
        expect(screen.getByTestId('valid')).toHaveTextContent('false');
      });
    });

    it('should track submitting state', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      function SubmittingTracker() {
        const { submitting } = useFormState({ submitting: true });

        return <div data-testid="submitting">{String(submitting)}</div>;
      }

      render(
        <Form onSubmit={onSubmit} initialValues={{ name: '' }}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <button type="submit">Submit</button>
          <SubmittingTracker />
        </Form>,
      );

      expect(screen.getByTestId('submitting')).toHaveTextContent('false');

      await user.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(screen.getByTestId('submitting')).toHaveTextContent('true');
      });

      await waitFor(() => {
        expect(screen.getByTestId('submitting')).toHaveTextContent('false');
      }, { timeout: 200 });
    });

    it('should track submitSucceeded state', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      function SubmitSuccessTracker() {
        const { submitSucceeded } = useFormState({ submitSucceeded: true });

        return <div data-testid="submit-succeeded">{String(submitSucceeded)}</div>;
      }

      render(
        <Form onSubmit={onSubmit} initialValues={{ name: 'test' }} enableBatching={false}>
          <button type="submit">Submit</button>
          <SubmitSuccessTracker />
        </Form>,
      );

      expect(screen.getByTestId('submit-succeeded')).toHaveTextContent('false');

      await user.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(screen.getByTestId('submit-succeeded')).toHaveTextContent('true');
      });
    });

    it('should re-render when a field is touched (blurred)', async () => {
      const user = userEvent.setup();

      function TouchedSubscriber() {
        const { touched } = useFormState({ touched: true });
        const touchedCount = Object.values(touched || {}).filter(Boolean).length;

        return <div data-testid="touched-count">{touchedCount}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <TouchedSubscriber />
        </Form>,
      );

      expect(screen.getByTestId('touched-count')).toHaveTextContent('0');

      // Focus then blur the field
      await user.click(screen.getByTestId('name'));
      await user.tab();

      await waitFor(() => {
        expect(screen.getByTestId('touched-count')).toHaveTextContent('1');
      });
    });

    it('should re-render when a field gains and loses focus', async () => {
      const user = userEvent.setup();

      function ActiveSubscriber() {
        const { active } = useFormState({ active: true });

        return <div data-testid="active">{active || 'none'}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '', email: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <Field name="email">
            {({ input }) => <input data-testid="email" {...input} />}
          </Field>
          <ActiveSubscriber />
        </Form>,
      );

      expect(screen.getByTestId('active')).toHaveTextContent('none');

      await user.click(screen.getByTestId('name'));

      await waitFor(() => {
        expect(screen.getByTestId('active')).toHaveTextContent('name');
      });

      await user.click(screen.getByTestId('email'));

      await waitFor(() => {
        expect(screen.getByTestId('active')).toHaveTextContent('email');
      });
    });
  });

  describe('Errors tracking', () => {
    it('should track form-level errors', async () => {
      const user = userEvent.setup();

      function ErrorsTracker() {
        const { errors } = useFormState({ errors: true });

        return (
          <div>
            <div data-testid="has-errors">{String(Object.keys(errors || {}).length > 0)}</div>
            <div data-testid="email-error">{errors?.email || 'none'}</div>
          </div>
        );
      }

      render(
        <Form
          onSubmit={() => {}}
          initialValues={{ email: '' }}
          validate={(values) => {
            if (!values.email?.includes('@')) {
              return { email: 'Invalid email' };
            }

            return null;
          }}
          formValidateOn="submit"
          enableBatching={false}
        >
          <Field name="email">
            {({ input }) => <input data-testid="email" {...input} />}
          </Field>
          <button type="submit">Submit</button>
          <ErrorsTracker />
        </Form>,
      );

      await user.type(screen.getByTestId('email'), 'invalid');
      await user.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('Invalid email');
      }, { timeout: 2000 });
    });
  });

  describe('Multiple subscribers', () => {
    it('should update all subscribers', async () => {
      const user = userEvent.setup();

      function Subscriber1() {
        const { dirty } = useFormState({ dirty: true });

        return <div data-testid="sub1">{String(dirty)}</div>;
      }

      function Subscriber2() {
        const { dirty } = useFormState({ dirty: true });

        return <div data-testid="sub2">{String(dirty)}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <Subscriber1 />
          <Subscriber2 />
        </Form>,
      );

      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('sub1')).toHaveTextContent('true');
        expect(screen.getByTestId('sub2')).toHaveTextContent('true');
      });
    });
  });

  describe('All subscription combinations', () => {
    it('should handle subscription to all states', () => {
      function AllStatesSubscriber() {
        const state = useFormState({
          values: true,
          dirty: true,
          pristine: true,
          valid: true,
          invalid: true,
          submitting: true,
          submitSucceeded: true,
          errors: true,
        });

        return (
          <div>
            <div data-testid="all-dirty">{String(state.dirty)}</div>
            <div data-testid="all-pristine">{String(state.pristine)}</div>
            <div data-testid="all-valid">{String(state.valid)}</div>
          </div>
        );
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }}>
          <AllStatesSubscriber />
        </Form>,
      );

      expect(screen.getByTestId('all-dirty')).toHaveTextContent('false');
      expect(screen.getByTestId('all-pristine')).toHaveTextContent('true');
      expect(screen.getByTestId('all-valid')).toHaveTextContent('true');
    });

    it('should handle no subscription', () => {
      function NoSubscription() {
        const state = useFormState({});

        return <div data-testid="no-sub">{String(state.dirty)}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }}>
          <NoSubscription />
        </Form>,
      );

      expect(screen.getByTestId('no-sub')).toHaveTextContent('false');
    });
  });

  describe('Re-render suppression', () => {
    it('should re-render when subscribed value changes', async () => {
      const user = userEvent.setup();
      const renderCount = { current: 0 };

      function ValuesOnlySubscriber() {
        const { values } = useFormState({ values: true });

        renderCount.current += 1;

        return <div data-testid="values">{values.name || ''}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '', other: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <Field name="other">
            {({ input }) => <input data-testid="other" {...input} />}
          </Field>
          <ValuesOnlySubscriber />
        </Form>,
      );

      const initialRenders = renderCount.current;

      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('values')).toHaveTextContent('test');
      });

      expect(renderCount.current).toBeGreaterThan(initialRenders);
    });

    it('should not re-render per keystroke when subscribed to dirty only', async () => {
      // Subscribe to dirty only. Typing 4 characters should trigger exactly 1 re-render
      // when the form flips from pristine to dirty — not one per character.
      const user = userEvent.setup();
      const renderCount = { current: 0 };

      function DirtyOnlySubscriber() {
        const { dirty } = useFormState({ dirty: true });

        renderCount.current += 1;

        return <div data-testid="dirty">{String(dirty)}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <DirtyOnlySubscriber />
        </Form>,
      );

      const initialRenders = renderCount.current;

      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('dirty')).toHaveTextContent('true');
      });

      // 4 characters typed but dirty only flips once — exactly 1 extra render
      expect(renderCount.current).toBe(initialRenders + 1);
    });

    it('should not re-render at all when subscribed key never changes', async () => {
      // Subscribe to errors only, type without any validation attached.
      // No ERROR event fires, so render count must not increase after mount.
      const user = userEvent.setup();
      const renderCount = { current: 0 };

      function ErrorsOnlySubscriber() {
        const { errors } = useFormState({ errors: true });

        renderCount.current += 1;

        return <div data-testid="errors">{Object.keys(errors || {}).length}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <ErrorsOnlySubscriber />
        </Form>,
      );

      const rendersAfterMount = renderCount.current;

      // Typing without a validator — no ERROR events fire
      await user.type(screen.getByTestId('name'), 'hello');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(renderCount.current).toBe(rendersAfterMount);
    });

    it('should not re-render when an unsubscribed key changes', async () => {
      // Subscribe to dirty only. Changing values fires VALUES events — no VALUES
      // listener is registered, so each keystroke produces zero extra renders
      // (except the single re-render when dirty flips for the first time).
      const user = userEvent.setup();
      const renderCount = { current: 0 };

      function DirtyOnlyRenderCounter() {
        const { dirty } = useFormState({ dirty: true });

        renderCount.current += 1;

        return <div data-testid="dirty">{String(dirty)}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ name: '' }} enableBatching={false}>
          <Field name="name">
            {({ input }) => <input data-testid="name" {...input} />}
          </Field>
          <DirtyOnlyRenderCounter />
        </Form>,
      );

      // Confirm dirty flipped exactly once despite 4 keystrokes
      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('dirty')).toHaveTextContent('true');
      });

      const rendersAfterDirty = renderCount.current;

      // Type 4 more characters — form stays dirty, no re-renders expected
      await user.type(screen.getByTestId('name'), 'more');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(renderCount.current).toBe(rendersAfterDirty);
    });
  });

  describe('Dynamic subscription changes', () => {
    it('should start receiving updates when a subscription key is dynamically enabled', async () => {
      // This verifies the fix for the frozen-subscriptions bug: subscriptions were
      // previously set up once at mount and never re-registered when keys changed.
      const user = userEvent.setup();
      // Stable reference — prevents engine recreation when Parent re-renders on toggle click
      const initialValues = { name: '' };

      function DynamicSubscriber({ subscribeToValues }) {
        const { values } = useFormState({ values: subscribeToValues });

        return <div data-testid="value">{values?.name || 'empty'}</div>;
      }

      function Parent() {
        const [subscribed, setSubscribed] = useState(false);

        return (
          <Form onSubmit={() => {}} initialValues={initialValues} enableBatching={false}>
            <Field name="name">
              {({ input }) => <input data-testid="name" {...input} />}
            </Field>
            <DynamicSubscriber subscribeToValues={subscribed} />
            <button
              data-testid="enable"
              type="button"
              onClick={() => setSubscribed(true)}
            >
              Enable
            </button>
          </Form>
        );
      }

      render(<Parent />);

      // Not subscribed — typing should not update the displayed value
      await user.type(screen.getByTestId('name'), 'hello');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(screen.getByTestId('value')).toHaveTextContent('empty');

      // Enable the values subscription
      await user.click(screen.getByTestId('enable'));

      // Type one more character — VALUES listener is now registered and fires
      await user.type(screen.getByTestId('name'), '!');

      await waitFor(() => {
        expect(screen.getByTestId('value')).toHaveTextContent('hello!');
      });
    });

    it('should stop receiving updates when a subscription key is dynamically disabled', async () => {
      const user = userEvent.setup();
      // Stable reference — prevents engine recreation when Parent re-renders on toggle click
      const initialValues = { name: '' };

      function DynamicSubscriber({ subscribeToDirty }) {
        const { dirty } = useFormState({ dirty: subscribeToDirty });

        return <div data-testid="dirty">{String(dirty)}</div>;
      }

      function Parent() {
        const [subscribed, setSubscribed] = useState(true);

        return (
          <Form onSubmit={() => {}} initialValues={initialValues} enableBatching={false}>
            <Field name="name">
              {({ input }) => <input data-testid="name" {...input} />}
            </Field>
            <DynamicSubscriber subscribeToDirty={subscribed} />
            <button
              data-testid="disable"
              type="button"
              onClick={() => setSubscribed(false)}
            >
              Disable
            </button>
          </Form>
        );
      }

      render(<Parent />);

      // Subscribed — dirty update should reach the component
      await user.type(screen.getByTestId('name'), 'a');

      await waitFor(() => {
        expect(screen.getByTestId('dirty')).toHaveTextContent('true');
      });

      // Disable the dirty subscription and clear the field back to initial
      await user.click(screen.getByTestId('disable'));
      await user.tripleClick(screen.getByTestId('name'));
      await user.keyboard('{Backspace}');

      // Give dirty microtask time to settle
      await new Promise(resolve => setTimeout(resolve, 50));

      // No longer subscribed — displayed value should remain stale (true), not update to false
      expect(screen.getByTestId('dirty')).toHaveTextContent('true');
    });
  });
});
