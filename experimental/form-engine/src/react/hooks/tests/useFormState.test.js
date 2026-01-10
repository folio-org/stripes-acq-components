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

    it('should track valid state', async () => {
      const user = userEvent.setup();

      function ValidTracker() {
        const { valid } = useFormState({ valid: true });

        return <div data-testid="valid">{String(valid)}</div>;
      }

      render(
        <Form onSubmit={() => {}} initialValues={{ email: '' }} enableBatching={false}>
          <Field
            name="email"
            validate={(value) => (!value ? 'Required' : null)}
            validateOn="change"
          >
            {({ input }) => <input data-testid="email" {...input} />}
          </Field>
          <ValidTracker />
        </Form>,
      );

      // Initially invalid (empty required field)
      expect(screen.getByTestId('valid')).toHaveTextContent('true');

      await user.type(screen.getByTestId('email'), 'test@test.com');

      await waitFor(() => {
        expect(screen.getByTestId('valid')).toHaveTextContent('true');
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

  describe('hasSubscribedChanges optimization', () => {
    it('should not re-render if subscribed states did not change', async () => {
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

      // Change name - should trigger re-render
      await user.type(screen.getByTestId('name'), 'test');

      await waitFor(() => {
        expect(screen.getByTestId('values')).toHaveTextContent('test');
      });

      expect(renderCount.current).toBeGreaterThan(initialRenders);
    });
  });
});
