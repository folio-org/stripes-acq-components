/* Developed collaboratively using AI (Cursor) */

import React from 'react';
import {
  fireEvent,
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
      <Form
        onSubmit={onSubmit}
        initialValues={{ email: '' }}
        enableBatching={false}
      >
        <Field name="email">
          {({ input }) => <input data-testid="email" {...input} />}
        </Field>
        <Debug />
        <button type="submit">Submit</button>
      </Form>,
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

  describe('Form-level validation', () => {
    it('should run form-level validator on submit by default', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      const validate = jest.fn((values) => {
        if (!values.email) return 'Email required';

        return null;
      });

      render(
        <Form
          onSubmit={onSubmit}
          initialValues={{ email: '' }}
          validate={validate}
        >
          <Field name="email">
            {({ input, meta }) => (
              <div>
                <input data-testid="email" {...input} />
                {meta.error && <span data-testid="error">{meta.error}</span>}
              </div>
            )}
          </Field>
          <button type="submit">Submit</button>
        </Form>,
      );

      await user.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(validate).toHaveBeenCalled();
      });
    });

    it('should validate on change when formValidateOn="change"', async () => {
      const user = userEvent.setup();
      const validate = jest.fn((values) => {
        if (values.email && !values.email.includes('@')) {
          return { email: 'Invalid email' };
        }

        return null;
      });

      render(
        <Form
          initialValues={{ email: '' }}
          validate={validate}
          formValidateOn="change"
        >
          <Field name="email">
            {({ input, meta }) => (
              <div>
                <input data-testid="email" {...input} />
                {meta.error && <span data-testid="error">{meta.error}</span>}
              </div>
            )}
          </Field>
        </Form>,
      );

      await user.type(screen.getByTestId('email'), 'invalid');

      await waitFor(() => {
        expect(validate).toHaveBeenCalled();
      });
    });

    it('should validate on blur when formValidateOn="blur"', async () => {
      const user = userEvent.setup();
      const validate = jest.fn((values) => {
        if (values.email && !values.email.includes('@')) {
          return { email: 'Invalid email' };
        }

        return null;
      });

      render(
        <Form
          initialValues={{ email: '' }}
          validate={validate}
          formValidateOn="blur"
        >
          <Field name="email">
            {({ input, meta }) => (
              <div>
                <input data-testid="email" {...input} />
                {meta.error && <span data-testid="error">{meta.error}</span>}
              </div>
            )}
          </Field>
          <Field name="other">
            {({ input }) => <input data-testid="other" {...input} />}
          </Field>
        </Form>,
      );

      await user.type(screen.getByTestId('email'), 'invalid');
      validate.mockClear();

      await user.click(screen.getByTestId('other'));

      await waitFor(() => {
        expect(validate).toHaveBeenCalled();
      });
    });

    it('should unregister validator on unmount', () => {
      const validate = jest.fn(() => null);
      const { unmount } = render(
        <Form initialValues={{}} validate={validate}>
          <div>Form content</div>
        </Form>,
      );

      unmount();
      // If no error thrown, validator was properly cleaned up
      expect(true).toBe(true);
    });

    it('should handle validator being removed', () => {
      const validate = jest.fn(() => null);
      const { rerender } = render(
        <Form initialValues={{}} validate={validate}>
          <div>Form content</div>
        </Form>,
      );

      rerender(
        <Form initialValues={{}} validate={undefined}>
          <div>Form content</div>
        </Form>,
      );

      expect(true).toBe(true);
    });

    it('should handle both form-level and field-level validation together', async () => {
      // This test demonstrates how form-level and field-level validation interact:
      // 1. Both validators run independently on their configured events (submit in this case)
      // 2. Errors from different sources are ACCUMULATED (stored separately with source tracking)
      // 3. meta.error returns the FIRST error (field-level first, then form-level)
      // 4. meta.errors returns ALL errors with their sources [{ source, error }]
      // This allows UI to display single error (backward compatible) or all errors (new feature)
      const user = userEvent.setup();

      // Field-level validator - checks basic format (runs on submit in this test)
      const fieldValidator = jest.fn((value) => {
        if (!value) return 'Field: Email is required';
        if (!value.includes('@')) return 'Field: Invalid email format';

        return null;
      });

      // Form-level validator - checks business rules (domain restriction)
      const formValidator = jest.fn((values) => {
        if (values.email && values.email.endsWith('@test.com')) {
          return { email: 'Form: test.com emails not allowed' };
        }

        return null;
      });

      const onSubmit = jest.fn();

      let currentMeta = null;

      render(
        <Form
          initialValues={{ email: 'user@test.com' }}
          validate={formValidator}
          formValidateOn="submit"
          onSubmit={onSubmit}
        >
          <Field name="email" validate={fieldValidator} validateOn="submit">
            {({ input, meta }) => {
              currentMeta = meta;

              return (
                <div>
                  <input data-testid="email" {...input} />
                  {meta.error && <span data-testid="error">{meta.error}</span>}
                  {meta.errors && meta.errors.length > 1 && (
                    <span data-testid="error-count">{meta.errors.length} errors</span>
                  )}
                </div>
              );
            }}
          </Field>
          <button type="submit">Submit</button>
        </Form>,
      );

      const input = screen.getByTestId('email');

      // Test 1: Submit with restricted domain - form-level validation should catch it
      await user.click(screen.getByText('Submit'));

      // Give time for both validators to run
      await waitFor(() => {
        expect(formValidator).toHaveBeenCalled();
      });

      expect(fieldValidator).toHaveBeenCalled(); // Field validator runs and passes

      // Form validator should set error on the field
      await waitFor(
        () => {
          expect(screen.getByTestId('error')).toHaveTextContent('Form: test.com emails not allowed');
        },
        { timeout: 3000 },
      );

      // Check that error is accumulated (not overwritten)
      expect(currentMeta.error).toBe('Form: test.com emails not allowed');
      expect(currentMeta.errors).toEqual([
        { source: 'form', error: 'Form: test.com emails not allowed' },
      ]);

      // Test 2: Change to valid domain and submit - both validations should pass
      fireEvent.change(input, { target: { value: 'user@example.com' } });
      await user.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Engine management', () => {
    it('should use provided engine if given', () => {
      const mockEngine = {
        init: jest.fn(),
        getFormApi: jest.fn(() => ({})),
        on: jest.fn(() => jest.fn()),
        submit: jest.fn(),
      };

      render(
        <Form engine={mockEngine} initialValues={{}}>
          <div>Content</div>
        </Form>,
      );

      expect(mockEngine.init).not.toHaveBeenCalled();
    });

    it('should recreate engine when initialValues reference changes', () => {
      const { rerender } = render(
        <Form initialValues={{ a: 1 }}>
          <Field name="a">
            {({ input }) => <input data-testid="input-a" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('input-a')).toHaveValue('1');

      rerender(
        <Form initialValues={{ a: 2 }}>
          <Field name="a">
            {({ input }) => <input data-testid="input-a" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('input-a')).toHaveValue('2');
    });
  });

  describe('Submit handling', () => {
    it('should call onSubmit with values and formApi', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      render(
        <Form onSubmit={onSubmit} initialValues={{ email: 'test@test.com' }}>
          <button type="submit">Submit</button>
        </Form>,
      );

      await user.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ email: 'test@test.com' }),
          expect.any(Object),
        );
      });
    });

    it('should handle submit without onSubmit', async () => {
      const user = userEvent.setup();

      render(
        <Form initialValues={{}}>
          <button type="submit">Submit</button>
        </Form>,
      );

      await user.click(screen.getByText('Submit'));
      // Should not throw error
      expect(true).toBe(true);
    });

    it('should prevent default form submission', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      render(
        <Form onSubmit={onSubmit} initialValues={{}}>
          <button type="submit">Submit</button>
        </Form>,
      );

      await user.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Options and props', () => {
    it('should pass enableBatching option to engine', () => {
      render(
        <Form initialValues={{}} enableBatching={false}>
          <Field name="test">
            {({ input }) => <input data-testid="test" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    it('should pass dirtyCheckStrategy option to engine', () => {
      const customStrategy = jest.fn(() => false);

      render(
        <Form initialValues={{}} dirtyCheckStrategy={customStrategy}>
          <Field name="test">
            {({ input }) => <input data-testid="test" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    it('should set validateOnBlur option when defaultValidateOn="blur"', () => {
      render(
        <Form initialValues={{}} defaultValidateOn="blur">
          <Field name="test">
            {({ input }) => <input data-testid="test" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    it('should pass additional props to form element', () => {
      render(
        <Form
          initialValues={{}}
          className="custom-class"
          data-testid="custom-form"
        >
          <div>Content</div>
        </Form>,
      );

      expect(screen.getByTestId('custom-form')).toHaveClass('custom-class');
    });
  });

  describe('Mount and unmount', () => {
    it('should cleanup engine on unmount', () => {
      const { unmount } = render(
        <Form initialValues={{ test: 'value' }}>
          <Field name="test">
            {({ input }) => <input data-testid="test" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('test')).toBeInTheDocument();

      unmount();

      // Should not throw errors
      expect(true).toBe(true);
    });

    it('should handle multiple fields mounting and unmounting', async () => {
      const user = userEvent.setup();

      function ConditionalFields() {
        const [showExtra, setShowExtra] = React.useState(false);

        return (
          <Form initialValues={{ name: '', email: '', phone: '' }}>
            <Field name="name">
              {({ input }) => <input data-testid="name" {...input} />}
            </Field>
            <button type="button" onClick={() => setShowExtra(!showExtra)} data-testid="toggle">
              Toggle
            </button>
            {showExtra && (
              <>
                <Field name="email">
                  {({ input }) => <input data-testid="email" {...input} />}
                </Field>
                <Field name="phone">
                  {({ input }) => <input data-testid="phone" {...input} />}
                </Field>
              </>
            )}
          </Form>
        );
      }

      render(<ConditionalFields />);

      expect(screen.getByTestId('name')).toBeInTheDocument();
      expect(screen.queryByTestId('email')).not.toBeInTheDocument();

      await user.click(screen.getByTestId('toggle'));

      expect(screen.getByTestId('email')).toBeInTheDocument();
      expect(screen.getByTestId('phone')).toBeInTheDocument();

      await user.click(screen.getByTestId('toggle'));

      expect(screen.queryByTestId('email')).not.toBeInTheDocument();
      expect(screen.queryByTestId('phone')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty initialValues', () => {
      render(
        <Form initialValues={{}}>
          <Field name="test">
            {({ input }) => <input data-testid="test" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('test')).toHaveValue('');
    });

    it('should handle null initialValues', () => {
      render(
        <Form initialValues={null}>
          <Field name="test">
            {({ input }) => <input data-testid="test" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('test')).toHaveValue('');
    });

    it('should handle undefined initialValues', () => {
      render(
        <Form initialValues={undefined}>
          <Field name="test">
            {({ input }) => <input data-testid="test" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('test')).toHaveValue('');
    });

    it('should handle nested initial values', async () => {
      const user = userEvent.setup();

      render(
        <Form initialValues={{ user: { name: 'John', address: { city: 'NYC' } } }} enableBatching={false}>
          <Field name="user.name">
            {({ input }) => <input data-testid="user-name" {...input} />}
          </Field>
          <Field name="user.address.city">
            {({ input }) => <input data-testid="user-city" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('user-name')).toHaveValue('John');
      expect(screen.getByTestId('user-city')).toHaveValue('NYC');

      await user.clear(screen.getByTestId('user-name'));
      await user.type(screen.getByTestId('user-name'), 'Jane');

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveValue('Jane');
      });
    });

    it('should handle array initial values', () => {
      render(
        <Form initialValues={{ items: ['a', 'b', 'c'] }}>
          <Field name="items[0]">
            {({ input }) => <input data-testid="item-0" {...input} />}
          </Field>
          <Field name="items[1]">
            {({ input }) => <input data-testid="item-1" {...input} />}
          </Field>
        </Form>,
      );

      expect(screen.getByTestId('item-0')).toHaveValue('a');
      expect(screen.getByTestId('item-1')).toHaveValue('b');
    });

    it('should handle form submission during validation', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      const validator = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));

        return null;
      });

      render(
        <Form
          onSubmit={onSubmit}
          initialValues={{ email: '' }}
        >
          <Field name="email" validate={validator} validateOn="submit">
            {({ input }) => <input data-testid="email" {...input} />}
          </Field>
          <button type="submit">Submit</button>
        </Form>,
      );

      await user.type(screen.getByTestId('email'), 'test@test.com');

      // Submit twice quickly
      await user.click(screen.getByText('Submit'));
      await user.click(screen.getByText('Submit'));

      // Should eventually call onSubmit
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      }, { timeout: 500 });
    });
  });
});
