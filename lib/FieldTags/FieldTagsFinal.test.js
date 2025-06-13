import { MemoryRouter } from 'react-router-dom';

import {
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

    expect(screen.getByText('0 items selected')).toBeDefined();

    await userEvent.click(screen.getByText('tag1'));

    expect(screen.getByText('1 item selected')).toBeDefined();
  });

  it('should display preselected tags and handle clicks', async () => {
    const tags = ['tag1', 'tag2'];

    renderComponent(
      { formValues: { tags } },
      { initialValues: { tags } },
    );

    expect(screen.getByText('2 items selected')).toBeDefined();

    await userEvent.click(screen.getAllByLabelText('times')[0]);

    expect(screen.getByText('1 item selected')).toBeDefined();
  });

  it('should add newly created tag to the selected list', async () => {
    const tags = ['tag1', 'tag2'];

    renderComponent(
      { formValues: { tags } },
      { initialValues: { tags } },
    );

    await userEvent.type(screen.getByRole('combobox', { name: 'stripes-acq-components.label.tags' }), 'qwerty');
    await userEvent.click(screen.getByText('stripes-acq-components.addTagFor'));

    expect(screen.getByText('3 items selected')).toBeDefined();
    expect(defaultProps.onAdd).toHaveBeenCalledWith('qwerty');
  });
});
