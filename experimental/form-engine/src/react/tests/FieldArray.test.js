/* Developed collaboratively using AI (Cursor) */

import {
  render,
  screen,
  waitFor,
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
      </Form>,
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
      </Form>,
    );
    await user.click(screen.getByTestId('push'));
    // Wait for batched state update and field array re-render
    await waitFor(() => {
      expect(screen.getByTestId('item-0')).toBeInTheDocument();
    });
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
      </Form>,
    );
    await user.click(screen.getByTestId('remove-0'));
    // After removal the array should have one item (the original item-1 shifted to index 0)
    await waitFor(() => {
      expect(screen.getAllByTestId(/item-/)).toHaveLength(1);
    });
    expect(screen.getByTestId('item-0')).toBeInTheDocument(); // item-1 becomes item-0
  });

  describe('Array operations', () => {
    it('should insert items at specific index', async () => {
      const user = userEvent.setup();

      render(
        <Form onSubmit={() => {}} initialValues={{ items: ['a', 'b', 'c'] }} enableBatching={false}>
          <FieldArray name="items">
            {({ fields, insert }) => (
              <div>
                {fields.map((field) => (
                  <Field key={field.__id} name={field.name}>
                    {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                  </Field>
                ))}
                <button type="button" onClick={() => insert(1, 'x')} data-testid="insert">
                  Insert at 1
                </button>
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      await user.click(screen.getByTestId('insert'));

      await waitFor(() => {
        expect(screen.getAllByTestId(/item-/)).toHaveLength(4);
      });

      expect(screen.getByTestId('item-0')).toHaveValue('a');
      expect(screen.getByTestId('item-1')).toHaveValue('x');
      expect(screen.getByTestId('item-2')).toHaveValue('b');
    });

    it('should swap two items', async () => {
      const user = userEvent.setup();

      render(
        <Form onSubmit={() => {}} initialValues={{ items: ['a', 'b', 'c'] }} enableBatching={false}>
          <FieldArray name="items">
            {({ fields, swap }) => (
              <div>
                {fields.map((field) => (
                  <Field key={field.__id} name={field.name}>
                    {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                  </Field>
                ))}
                <button type="button" onClick={() => swap(0, 2)} data-testid="swap">
                  Swap 0 and 2
                </button>
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      await user.click(screen.getByTestId('swap'));

      await waitFor(() => {
        expect(screen.getByTestId('item-0')).toHaveValue('c');
        expect(screen.getByTestId('item-2')).toHaveValue('a');
      });
    });

    it('should move item from one index to another', async () => {
      const user = userEvent.setup();

      render(
        <Form onSubmit={() => {}} initialValues={{ items: ['a', 'b', 'c', 'd'] }} enableBatching={false}>
          <FieldArray name="items">
            {({ fields, move }) => (
              <div>
                {fields.map((field) => (
                  <Field key={field.__id} name={field.name}>
                    {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                  </Field>
                ))}
                <button type="button" onClick={() => move(0, 2)} data-testid="move">
                  Move 0 to 2
                </button>
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      await user.click(screen.getByTestId('move'));

      await waitFor(() => {
        expect(screen.getByTestId('item-0')).toHaveValue('b');
        expect(screen.getByTestId('item-1')).toHaveValue('c');
        expect(screen.getByTestId('item-2')).toHaveValue('a');
      });
    });

    it('should update item at index', async () => {
      const user = userEvent.setup();

      render(
        <Form onSubmit={() => {}} initialValues={{ items: [{ name: 'a' }, { name: 'b' }] }} enableBatching={false}>
          <FieldArray name="items">
            {({ fields, update }) => (
              <div>
                {fields.map((field) => (
                  <Field key={field.__id} name={`${field.name}.name`}>
                    {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                  </Field>
                ))}
                <button type="button" onClick={() => update(0, { name: 'x' })} data-testid="update">
                  Update 0
                </button>
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      await user.click(screen.getByTestId('update'));

      await waitFor(() => {
        expect(screen.getByTestId('item-0')).toHaveValue('x');
      });
    });

    it('should clear entire array', async () => {
      const user = userEvent.setup();

      render(
        <Form onSubmit={() => {}} initialValues={{ items: ['a', 'b'] }} enableBatching={false}>
          <FieldArray name="items">
            {({ fields, clear }) => (
              <div>
                <div data-testid="count">{fields.length}</div>
                {fields.map((field) => (
                  <Field key={field.__id} name={field.name}>
                    {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                  </Field>
                ))}
                <button type="button" onClick={() => clear()} data-testid="clear">
                  Clear All
                </button>
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      await user.click(screen.getByTestId('clear'));

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('0');
      });
    });
  });

  describe('Empty arrays', () => {
    it('should handle empty initial array', () => {
      render(
        <Form onSubmit={() => {}} initialValues={{ items: [] }}>
          <FieldArray name="items">
            {({ fields }) => (
              <div>
                <div data-testid="count">{fields.length}</div>
                {fields.map((field) => (
                  <Field key={field.__id} name={field.name}>
                    {({ input }) => <input data-testid={`item-${field.index}`} {...input} />}
                  </Field>
                ))}
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('should handle undefined array field', () => {
      render(
        <Form onSubmit={() => {}} initialValues={{}}>
          <FieldArray name="items">
            {({ fields }) => (
              <div>
                <div data-testid="count">{fields.length}</div>
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('should handle removing all items', async () => {
      const user = userEvent.setup();

      render(
        <Form onSubmit={() => {}} initialValues={{ items: ['a'] }}>
          <FieldArray name="items">
            {({ fields, remove }) => (
              <div>
                <div data-testid="count">{fields.length}</div>
                {fields.map((field) => (
                  <button
                    key={field.__id}
                    type="button"
                    onClick={() => remove(field.index)}
                    data-testid={`remove-${field.index}`}
                  >
                    Remove
                  </button>
                ))}
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      await user.click(screen.getByTestId('remove-0'));

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('0');
      });
    });
  });

  describe('Nested arrays', () => {
    it('should handle nested array fields', async () => {
      const user = userEvent.setup();

      render(
        <Form
          onSubmit={() => {}}
          initialValues={{
            sections: [
              { items: ['a', 'b'] },
              { items: ['c', 'd'] },
            ],
          }}
        >
          <FieldArray name="sections">
            {({ fields: sections }) => (
              <div>
                {sections.map((section) => (
                  <div key={section.__id}>
                    <FieldArray name={`${section.name}.items`}>
                      {({ fields: items }) => (
                        <div>
                          {items.map((item) => (
                            <Field key={item.__id} name={item.name}>
                              {({ input }) => (
                                <input
                                  data-testid={`section-${section.index}-item-${item.index}`}
                                  {...input}
                                />
                              )}
                            </Field>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                ))}
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      expect(screen.getByTestId('section-0-item-0')).toHaveValue('a');
      expect(screen.getByTestId('section-1-item-0')).toHaveValue('c');

      await user.type(screen.getByTestId('section-0-item-0'), 'x');

      await waitFor(() => {
        expect(screen.getByTestId('section-0-item-0')).toHaveValue('ax');
      });
    });
  });

  describe('With validation', () => {
    it('should validate array items', async () => {
      const user = userEvent.setup();

      render(
        <Form onSubmit={() => {}} initialValues={{ emails: [''] }}>
          <FieldArray name="emails">
            {({ fields }) => (
              <div>
                {fields.map((field) => (
                  <Field
                    key={field.__id}
                    name={field.name}
                    validate={(value) => (!value?.includes('@') ? 'Invalid email' : null)}
                  >
                    {({ input, meta }) => (
                      <div>
                        <input data-testid={`email-${field.index}`} {...input} />
                        {meta.error && (
                          <span data-testid={`error-${field.index}`}>{meta.error}</span>
                        )}
                      </div>
                    )}
                  </Field>
                ))}
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      await user.type(screen.getByTestId('email-0'), 'invalid');
      await user.tab();

      // Should show error for invalid email
      await waitFor(() => {
        expect(screen.getByTestId('error-0')).toHaveTextContent('Invalid email');
      });
    });
  });

  describe('Custom selectors', () => {
    it('should use custom selector for array values', async () => {
      const user = userEvent.setup();

      function ArrayWithLength() {
        return (
          <Form onSubmit={() => {}} initialValues={{ items: ['a', 'b'] }}>
            <FieldArray name="items">
              {({ fields, push }) => (
                <div>
                  <div data-testid="length">{fields.length}</div>
                  <button type="button" onClick={() => push('x')} data-testid="push">
                    Push
                  </button>
                </div>
              )}
            </FieldArray>
          </Form>
        );
      }

      render(<ArrayWithLength />);

      expect(screen.getByTestId('length')).toHaveTextContent('2');

      await user.click(screen.getByTestId('push'));

      await waitFor(() => {
        expect(screen.getByTestId('length')).toHaveTextContent('3');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid operations', async () => {
      const user = userEvent.setup();

      render(
        <Form onSubmit={() => {}} initialValues={{ items: [] }} enableBatching={false}>
          <FieldArray name="items">
            {({ fields, push, remove }) => (
              <div>
                <div data-testid="count">{fields.length}</div>
                {fields.map((field) => (
                  <div key={field.__id}>
                    <button type="button" onClick={() => remove(field.index)} data-testid={`remove-${field.index}`}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => push('x')} data-testid="push">
                  Push
                </button>
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      // Rapid push/remove
      await user.click(screen.getByTestId('push'));
      await user.click(screen.getByTestId('push'));
      await user.click(screen.getByTestId('push'));

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('3');
      });

      await user.click(screen.getByTestId('remove-2'));
      await user.click(screen.getByTestId('remove-1'));

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('1');
      });
    });

    it('should handle non-primitive values', async () => {
      const user = userEvent.setup();

      render(
        <Form
          onSubmit={() => {}}
          initialValues={{ items: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }] }}
          enableBatching={false}
        >
          <FieldArray name="items">
            {({ fields, push }) => (
              <div>
                {fields.map((field) => (
                  <Field key={field.__id} name={`${field.name}.name`}>
                    {({ input }) => <input data-testid={`name-${field.index}`} {...input} />}
                  </Field>
                ))}
                <button
                  type="button"
                  onClick={() => push({ id: 3, name: 'Bob' })}
                  data-testid="push"
                >
                  Push
                </button>
              </div>
            )}
          </FieldArray>
        </Form>,
      );

      expect(screen.getByTestId('name-0')).toHaveValue('John');

      await user.click(screen.getByTestId('push'));

      await waitFor(() => {
        expect(screen.getByTestId('name-2')).toHaveValue('Bob');
      });
    });
  });
});
