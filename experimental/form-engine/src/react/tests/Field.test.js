/* Developed collaboratively using AI (Cursor) */

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  Field,
  Form,
} from '../../index';

describe('Field', () => {
  it('should render input with value', async () => {
    const user = userEvent.setup();

    render(
      <Form onSubmit={() => {}} initialValues={{ name: 'test' }}>
        <Field name="name" />
      </Form>,
    );

    // Input should have initial value after render
    const input = await screen.findByDisplayValue('test');

    expect(input).toBeInTheDocument();

    // Clear and type new value
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'testx');
      // Give batching time to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    expect(input).toHaveValue('testx');
  });

  it('should render with component prop', () => {
    const CustomInput = ({ value, onChange, ...props }) => (
      <input data-testid="custom" value={value} onChange={onChange} {...props} />
    );

    render(
      <Form onSubmit={() => {}} initialValues={{ name: 'test' }}>
        <Field name="name" component={CustomInput} />
      </Form>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('should render with children render prop', () => {
    render(
      <Form onSubmit={() => {}} initialValues={{ name: 'test' }}>
        <Field name="name">
          {({ input, meta }) => (
            <div>
              <input data-testid="name" {...input} />
              <span data-testid="error">{meta.error}</span>
            </div>
          )}
        </Field>
      </Form>,
    );
    expect(screen.getByTestId('name')).toBeInTheDocument();
  });

  it('should format value', async () => {
    render(
      <Form onSubmit={() => {}} initialValues={{ phone: '1234567890' }}>
        <Field
          name="phone"
          format={(value) => value?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
        />
      </Form>,
    );
    // Format should be applied to initial value
    const input = await screen.findByDisplayValue('(123) 456-7890');

    expect(input).toBeInTheDocument();
  });

  describe('Validation modes', () => {
    it('should validate on blur when validateOn="blur"', async () => {
      const user = userEvent.setup();
      const validator = jest.fn((value) => (!value ? 'Required' : null));

      render(
        <Form onSubmit={() => {}}>
          <Field
            name="email"
            validate={validator}
            validateOn="blur"
          >
            {({ input, meta }) => (
              <div>
                <input data-testid="email" {...input} />
                {meta.error && <span data-testid="error">{meta.error}</span>}
              </div>
            )}
          </Field>
        </Form>,
      );

      const input = screen.getByTestId('email');

      // Focus and blur without typing - should validate
      await act(async () => {
        await user.click(input);
        await user.tab(); // blur
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Validator should be called on blur
      expect(validator).toHaveBeenCalled();

      // Error should appear
      await screen.findByTestId('error');
      expect(screen.getByTestId('error')).toHaveTextContent('Required');
    });

    it('should validate on change when validateOn="change"', async () => {
      const user = userEvent.setup();
      const validator = jest.fn((value) => (value?.length < 3 ? 'Too short' : null));

      render(
        <Form onSubmit={() => {}}>
          <Field
            name="username"
            validate={validator}
            validateOn="change"
            debounceDelay={0}
          >
            {({ input, meta }) => (
              <div>
                <input data-testid="username" {...input} />
                {meta.error && <span data-testid="error">{meta.error}</span>}
              </div>
            )}
          </Field>
        </Form>,
      );

      const input = screen.getByTestId('username');

      // Type short value - should validate on each change
      await act(async () => {
        await user.type(input, 'a');
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Validator should be called
      expect(validator).toHaveBeenCalled();

      // Error should appear for short value
      await screen.findByTestId('error');
      expect(screen.getByTestId('error')).toHaveTextContent('Too short');

      validator.mockClear();

      // Type more characters
      await act(async () => {
        await user.type(input, 'b');
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Validator should be called again
      expect(validator).toHaveBeenCalled();
    });

    it('should validate on submit when validateOn="submit"', async () => {
      const user = userEvent.setup();
      const validator = jest.fn((value) => (!value ? 'Required' : null));
      const onSubmit = jest.fn();

      render(
        <Form onSubmit={onSubmit}>
          <Field
            name="email"
            validate={validator}
            validateOn="submit"
          >
            {({ input, meta }) => (
              <div>
                <input data-testid="email" {...input} />
                {meta.error && <span data-testid="error">{meta.error}</span>}
              </div>
            )}
          </Field>
          <button type="submit" data-testid="submit">Submit</button>
        </Form>,
      );

      const input = screen.getByTestId('email');
      const submit = screen.getByTestId('submit');

      // Type and blur - should NOT validate yet
      await act(async () => {
        await user.click(input);
        await user.tab();
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // No validation should happen yet
      expect(validator).not.toHaveBeenCalled();
      expect(screen.queryByTestId('error')).not.toBeInTheDocument();

      // Submit form - should validate
      await act(async () => {
        await user.click(submit);
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Validator should be called on submit
      expect(validator).toHaveBeenCalled();

      // Error should appear
      await screen.findByTestId('error');
      expect(screen.getByTestId('error')).toHaveTextContent('Required');

      // Form should not submit due to error
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should debounce validation in change mode', async () => {
      const user = userEvent.setup();
      const validator = jest.fn((value) => (value?.length < 3 ? 'Too short' : null));

      render(
        <Form onSubmit={() => {}}>
          <Field
            name="search"
            validate={validator}
            validateOn="change"
            debounceDelay={300}
          >
            {({ input, meta }) => (
              <div>
                <input data-testid="search" {...input} />
                {meta.error && <span data-testid="error">{meta.error}</span>}
              </div>
            )}
          </Field>
        </Form>,
      );

      const input = screen.getByTestId('search');

      // Type quickly - validation should be debounced
      await act(async () => {
        await user.type(input, 'ab', { delay: 50 }); // Fast typing
        // Don't wait - validator should not be called immediately
      });

      // Validator should not be called immediately
      expect(validator).not.toHaveBeenCalled();

      // Wait for debounce
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
      });

      // Now validator should be called once
      expect(validator).toHaveBeenCalledTimes(1);
    });

    it('should not validate on blur when validateOn="submit"', async () => {
      const user = userEvent.setup();
      const validator = jest.fn((value) => (!value ? 'Required' : null));

      render(
        <Form onSubmit={() => {}}>
          <Field
            name="email"
            validate={validator}
            validateOn="submit"
          >
            {({ input }) => <input data-testid="email" {...input} />}
          </Field>
        </Form>,
      );

      const input = screen.getByTestId('email');

      // Focus and blur - should NOT validate
      await act(async () => {
        await user.click(input);
        await user.tab();
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Validator should not be called
      expect(validator).not.toHaveBeenCalled();
    });

    it('should keep error on blur when validateOn="submit" until next explicit validation', async () => {
      const user = userEvent.setup();
      const validator = jest.fn((value) => (!value ? 'Required' : null));
      const onSubmit = jest.fn();

      render(
        <Form onSubmit={onSubmit}>
          <Field
            name="email"
            validate={validator}
            validateOn="submit"
          >
            {({ input, meta }) => (
              <div>
                <input data-testid="email" {...input} />
                {meta.error && <span data-testid="error">{meta.error}</span>}
              </div>
            )}
          </Field>
          <button type="submit" data-testid="submit">Submit</button>
        </Form>,
      );

      const input = screen.getByTestId('email');
      const submit = screen.getByTestId('submit');

      // Submit with empty field - should show error
      await act(async () => {
        await user.click(submit);
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      await screen.findByTestId('error');

      // Now type value and blur - error should REMAIN (not cleared on blur)
      await act(async () => {
        await user.type(input, 'test@test.com');
        await user.tab();
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Error should still be visible after blur
      expect(screen.queryByTestId('error')).toBeInTheDocument();

      // Error should clear only after next submit
      await act(async () => {
        await user.click(submit);
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    });
  });
});
