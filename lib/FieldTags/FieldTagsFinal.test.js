import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import FieldTagsFinal from './FieldTagsFinal';

const allTags = [
  { id: '1', label: 'tag1' },
  { id: '2', label: 'tag2' },
];

const Form = stripesFinalForm({})(({ children }) => (
  <form>
    {children}
  </form>
));

const defaultFormProps = {
  onSubmit: jest.fn(),
  initialValues: { tags: [] },
};

const defaultProps = {
  allTags,
  name: 'tags',
  onAdd: jest.fn(),
};

const renderComponent = (props = {}, formProps = {}) => render(
  <Form
    {...defaultFormProps}
    {...formProps}
  >
    <FieldTagsFinal
      {...defaultProps}
      {...props}
    />,
  </Form>,
  { wrapper: MemoryRouter },
);

describe('FieldTagsFinal', () => {
  it('should add new record and assign it', async () => {
    renderComponent();

    expect(screen.getByText('0 items selected')).toBeInTheDocument();

    await userEvent.click(screen.getByText('tag1'));

    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('should display preselected tags and handle clicks', async () => {
    const tags = ['tag1', 'tag2'];

    renderComponent(
      { formValues: { tags } },
      { initialValues: { tags } },
    );

    expect(screen.getByText('2 items selected')).toBeInTheDocument();

    await userEvent.click(screen.getAllByLabelText('times')[0]);

    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('should add newly created tag to the selected list', async () => {
    const tags = ['tag1', 'tag2'];

    renderComponent(
      { formValues: { tags } },
      { initialValues: { tags } },
    );

    await userEvent.type(screen.getByRole('combobox', { name: 'stripes-acq-components.label.tags' }), 'qwerty');
    await userEvent.click(screen.getByText('stripes-acq-components.addTagFor'));

    expect(screen.getByText('3 items selected')).toBeInTheDocument();
    expect(defaultProps.onAdd).toHaveBeenCalledWith('qwerty');
  });

  it('should use actual form values when form values are changed programmatically', async () => {
    const onAddSpy = jest.fn();
    const initialTags = ['tag1'];
    let formApi;

    const FormWithRef = stripesFinalForm({})(({ children, form }) => {
      formApi = form;

      return <form>{children}</form>;
    });

    render(
      <FormWithRef
        onSubmit={jest.fn()}
        initialValues={{ tags: initialTags }}
      >
        <FieldTagsFinal
          {...defaultProps}
          onAdd={onAddSpy}
        />
      </FormWithRef>,
      { wrapper: MemoryRouter },
    );

    // Verify initial state
    expect(screen.getByText('1 item selected')).toBeInTheDocument();

    // Programmatically change the tags field via form's change method
    await act(async () => {
      formApi.change('tags', ['tag1', 'tag2', 'programmatic-tag']);
    });

    // Verify the UI reflects the programmatic change
    expect(screen.getByText('3 items selected')).toBeInTheDocument();

    // Now add a new tag and verify addTag function receives current form values
    await act(async () => {
      await userEvent.type(screen.getByRole('combobox', { name: 'stripes-acq-components.label.tags' }), 'newtag');
      await userEvent.click(screen.getByText('stripes-acq-components.addTagFor'));
    });

    // Verify that onAdd was called with the new tag
    expect(onAddSpy).toHaveBeenCalledWith('newtag');

    // Verify that the component now shows 4 items (3 programmatic + 1 new)
    expect(screen.getByText('4 items selected')).toBeInTheDocument();

    // Verify the form state contains all expected tags
    const currentFormValues = formApi.getState().values;

    expect(currentFormValues.tags).toEqual([
      'tag1',
      'tag2',
      'programmatic-tag',
      'newtag',
    ]);
  });
});
