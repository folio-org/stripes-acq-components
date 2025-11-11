/* Developed collaboratively using AI (Cursor) */

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  Field,
  FieldArray,
  Form,
} from '../../index';

describe('FieldArray', () => {
  it('should render array fields', () => {
    render(
      <Form onSubmit={() => {}} initialValues={{ items: [{ name: 'item1' }, { name: 'item2' }] }}>
        <FieldArray name="items">
          {({ fields }) => (
            <div>
              {fields.map((field) => (
                <Field key={field.__id} name={field.name}>
                  {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                </Field>
              ))}
            </div>
          )}
        </FieldArray>
      </Form>
    );
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  it('should push items to array', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={() => {}} initialValues={{ items: [] }}>
        <FieldArray name="items">
          {({ fields, push }) => (
            <div>
              {fields.map((field) => (
                <Field key={field.__id} name={field.name}>
                  {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                </Field>
              ))}
              <button type="button" onClick={() => push({ name: 'new' })} data-testid="push">
                Push
              </button>
            </div>
          )}
        </FieldArray>
      </Form>
    );
    await user.click(screen.getByTestId('push'));
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
  });

  it('should remove items from array', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={() => {}} initialValues={{ items: [{ name: 'item1' }, { name: 'item2' }] }}>
        <FieldArray name="items">
          {({ fields, remove }) => (
            <div>
              {fields.map((field) => (
                <div key={field.__id}>
                  <Field name={field.name}>
                    {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                  </Field>
                  <button type="button" onClick={() => remove(field.index)} data-testid={`remove-${field.index}`}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </FieldArray>
      </Form>
    );
    await user.click(screen.getByTestId('remove-0'));
    expect(screen.queryByTestId('item-0')).not.toBeInTheDocument();
    expect(screen.getByTestId('item-0')).toBeInTheDocument(); // item-1 becomes item-0
  });
});

