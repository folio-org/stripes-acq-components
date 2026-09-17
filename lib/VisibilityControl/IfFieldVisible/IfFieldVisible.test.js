import { ARRAY_ERROR } from 'final-form';
import {
  Field,
  Form,
} from 'react-final-form';
import { useEffect } from 'react';

import {
  act,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import IfFieldVisible from './IfFieldVisible';

let mockOnChange;
let mockRenderActualFormSpy = true;

jest.mock('react-final-form', () => {
  const actual = jest.requireActual('react-final-form');
  const React = jest.requireActual('react');

  return {
    ...actual,
    FormSpy: (props) => {
      mockOnChange = props.onChange;

      return mockRenderActualFormSpy
        ? React.createElement(actual.FormSpy, props)
        : null;
    },
  };
});

const visibleText = 'Visible';

const renderComponent = (props = {}, formProps = {}) => {
  mockRenderActualFormSpy = true;

  return render(
    <Form
      {...formProps}
      onSubmit={() => jest.fn()}
      render={() => (
        <IfFieldVisible
          {...props}
        />
      )}
    />,
  );
};

const renderLifecycleComponent = ({ children = <span>{visibleText}</span>, ...props } = {}) => {
  mockRenderActualFormSpy = false;

  return render(
    <IfFieldVisible
      name="fieldName"
      visible={false}
      {...props}
    >
      {children}
    </IfFieldVisible>,
  );
};

const publishErrors = async (errors) => {
  await act(async () => mockOnChange({ errors }));
};

const deferred = () => {
  let reject;
  let resolve;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, reject, resolve };
};

describe('IfFieldVisible', () => {
  it('should render child component', () => {
    renderComponent({ children: <span>{visibleText}</span>, name: 'fieldName' });

    expect(screen.queryByText(visibleText)).toBeVisible();
  });

  it('should hide child component', () => {
    renderComponent({ children: <span>{visibleText}</span>, visible: false, name: 'fieldName' });

    expect(screen.queryByText(visibleText)).not.toBeVisible();
  });

  it('should ignore a pending field-array validation error', async () => {
    const fieldErrors = [];

    fieldErrors[ARRAY_ERROR] = new Promise(() => {});

    renderComponent(
      { children: <span>{visibleText}</span>, visible: false, name: 'fieldArray' },
      { validate: () => ({ fieldArray: fieldErrors }) },
    );

    await act(async () => Promise.resolve());

    expect(screen.getByText(visibleText)).not.toBeVisible();
  });

  it('should show children when a pending field-array validation resolves with an error', async () => {
    let resolveValidation;
    const fieldErrors = [];

    fieldErrors[ARRAY_ERROR] = new Promise((resolve) => {
      resolveValidation = resolve;
    });

    renderComponent(
      { children: <span>{visibleText}</span>, visible: false, name: 'fieldArray' },
      { validate: () => ({ fieldArray: fieldErrors }) },
    );

    await act(async () => resolveValidation('Invalid array'));

    expect(screen.getByText(visibleText)).toBeVisible();
  });

  it('should show children for a resolved field-array error', async () => {
    const fieldErrors = [];

    fieldErrors[ARRAY_ERROR] = 'Invalid array';

    renderComponent(
      { children: <span>{visibleText}</span>, visible: false, name: 'fieldArray' },
      { validate: () => ({ fieldArray: fieldErrors }) },
    );

    await waitFor(() => expect(screen.getByText(visibleText)).toBeVisible());
  });

  it('should show children when a field-array item after the first one has an error', async () => {
    const fieldErrors = [undefined, 'Invalid item'];

    renderComponent(
      { children: <span>{visibleText}</span>, visible: false, name: 'fieldArray' },
      { validate: () => ({ fieldArray: fieldErrors }) },
    );

    await waitFor(() => expect(screen.getByText(visibleText)).toBeVisible());
  });

  it('should not remount a field when its error makes hidden children visible', async () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();
    let formApi;
    const Child = () => {
      useEffect(() => {
        onMount();

        return onUnmount;
      }, []);

      return <Field component="input" name="fieldName" />;
    };

    render(
      <Form
        onSubmit={() => jest.fn()}
        validate={({ fieldName }) => (
          fieldName ? { fieldName: 'Invalid field' } : {}
        )}
        render={({ form }) => {
          formApi = form;

          return (
            <IfFieldVisible visible={false} name="fieldName">
              <Child />
            </IfFieldVisible>
          );
        }}
      />,
    );

    act(() => formApi.change('fieldName', 'invalid'));

    await waitFor(() => expect(screen.getByRole('textbox')).toBeVisible());
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).not.toHaveBeenCalled();
  });
});

describe('IfFieldVisible validation lifecycle', () => {
  it.each([
    { description: 'a scalar field error', errors: { fieldName: 'Invalid field' } },
    {
      description: 'a nested field error',
      errors: { parent: { child: 'Invalid field' } },
      props: { name: 'parent.child' },
    },
    { description: 'a field-array item error', errors: { fieldName: [undefined, 'Invalid item'] } },
    {
      description: 'a field-array level error',
      errors: (() => {
        const errors = [];

        errors[ARRAY_ERROR] = 'Invalid array';

        return { fieldName: errors };
      })(),
    },
  ])('shows hidden children for $description', async ({ errors, props }) => {
    renderLifecycleComponent(props);

    await publishErrors(errors);

    expect(screen.getByText(visibleText)).toBeVisible();
  });

  it.each([
    ['undefined errors', undefined],
    ['an empty errors object', {}],
    ['a false scalar error', { fieldName: undefined }],
    ['an empty field array', { fieldName: [] }],
    ['a sparse field array without errors', { fieldName: [undefined, null, false] }],
  ])('keeps hidden children hidden for %s', async (description, errors) => {
    renderLifecycleComponent();

    await publishErrors(errors);

    expect(screen.getByText(visibleText)).not.toBeVisible();
  });

  it('checks every comma-separated field name and ignores whitespace and empty entries', async () => {
    renderLifecycleComponent({ name: ' first, , second ' });

    await publishErrors({ second: 'Invalid second field' });

    expect(screen.getByText(visibleText)).toBeVisible();
  });

  it('ignores validation errors when no field names are provided', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderLifecycleComponent({ name: undefined });

    await publishErrors({ fieldName: 'Unrelated error' });

    expect(screen.getByText(visibleText)).not.toBeVisible();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('stays visible when the visible prop is true and there are no errors', async () => {
    renderLifecycleComponent({ visible: true });

    await publishErrors({});

    expect(screen.getByText(visibleText)).toBeVisible();
  });

  it.each([
    ['scalar', (promise) => ({ fieldName: promise })],
    ['field-array item', (promise) => ({ fieldName: [promise] })],
    ['field-array level', (promise) => {
      const errors = [];

      errors[ARRAY_ERROR] = promise;

      return { fieldName: errors };
    }],
  ])('waits for an asynchronous %s error', async (description, createErrors) => {
    const validation = deferred();

    renderLifecycleComponent();
    const update = mockOnChange({ errors: createErrors(validation.promise) });

    expect(screen.getByText(visibleText)).not.toBeVisible();

    validation.resolve('Invalid field');
    await act(async () => update);

    expect(screen.getByText(visibleText)).toBeVisible();
  });

  it('hides children when asynchronous validation resolves without an error', async () => {
    const validation = deferred();

    renderLifecycleComponent();
    await publishErrors({ fieldName: 'Invalid field' });
    const update = mockOnChange({ errors: { fieldName: validation.promise } });

    expect(screen.getByText(visibleText)).toBeVisible();

    validation.resolve(undefined);
    await act(async () => update);

    expect(screen.getByText(visibleText)).not.toBeVisible();
  });

  it('ignores an older error result that settles after a newer successful result', async () => {
    const olderValidation = deferred();

    renderLifecycleComponent();
    const olderUpdate = mockOnChange({ errors: { fieldName: olderValidation.promise } });

    await publishErrors({});
    olderValidation.resolve('Stale error');
    await act(async () => olderUpdate);

    expect(screen.getByText(visibleText)).not.toBeVisible();
  });

  it('ignores an older successful result that settles after a newer error result', async () => {
    const olderValidation = deferred();

    renderLifecycleComponent();
    const olderUpdate = mockOnChange({ errors: { fieldName: olderValidation.promise } });

    await publishErrors({ fieldName: 'Current error' });
    olderValidation.resolve(undefined);
    await act(async () => olderUpdate);

    expect(screen.getByText(visibleText)).toBeVisible();
  });

  it('preserves the last settled visibility when validation rejects', async () => {
    const validation = deferred();

    renderLifecycleComponent();
    await publishErrors({ fieldName: 'Invalid field' });
    const update = mockOnChange({ errors: { fieldName: validation.promise } });

    validation.reject(new Error('Validation failed'));
    await act(async () => update);

    expect(screen.getByText(visibleText)).toBeVisible();
  });

  it('does not update visibility after unmounting with validation pending', async () => {
    const validation = deferred();
    const { unmount } = renderLifecycleComponent();
    const update = mockOnChange({ errors: { fieldName: validation.promise } });

    unmount();
    validation.resolve('Late error');
    await act(async () => update);

    expect(screen.queryByText(visibleText)).not.toBeInTheDocument();
  });

  it('preserves the mounted child through error and success transitions', async () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();
    const Child = () => {
      useEffect(() => {
        onMount();

        return onUnmount;
      }, []);

      return <span>{visibleText}</span>;
    };

    renderLifecycleComponent({ children: <Child /> });
    const child = screen.getByText(visibleText);

    await publishErrors({ fieldName: 'Invalid field' });
    await publishErrors({});

    expect(screen.getByText(visibleText)).toBe(child);
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).not.toHaveBeenCalled();
  });
});
