import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  useTags,
  useTagsConfigs,
  useTagsMutation,
} from '../hooks';
import FieldTagsContainer from './FieldTagsContainer';

jest.mock('../hooks', () => ({
  useTags: jest.fn(),
  useTagsConfigs: jest.fn(),
  useTagsMutation: jest.fn(),
}));

const TAGS = [
  { id: '1', label: 'tag1' },
  { id: '2', label: 'tag2' },
];

const defaultProps = {
  name: 'tags',
};

const Form = stripesFinalForm({})(({ children }) => (
  <form>
    {children}
  </form>
));

const wrapper = ({ children }) => (
  <MemoryRouter>
    <Form
      onSubmit={jest.fn()}
      initialValues={{ tags: ['test'] }}
    >
      {children}
    </Form>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <FieldTagsContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('FieldTagsContainer', () => {
  const createTagMock = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    useTags.mockReturnValue({
      refetch: jest.fn(),
      tags: TAGS,
    });
    useTagsConfigs.mockReturnValue({
      configs: [{ value: 'true' }],
      isFetched: true,
    });
    useTagsMutation.mockReturnValue({
      createTag: createTagMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render field if tags not enabled in settings', () => {
    useTagsConfigs.mockReturnValue({
      configs: [{ value: false }],
      isFetched: true,
    });

    renderComponent();

    expect(screen.queryByText('stripes-acq-components.label.tags')).not.toBeInTheDocument();
  });

  it('should load and pass tags', () => {
    renderComponent();

    TAGS.forEach(tag => {
      expect(screen.getByText(tag.label)).toBeInTheDocument();
    });
  });

  it('should call POST API on adding new tag', async () => {
    renderComponent();

    const newTagLabel = 'qwerty';

    await act(async () => {
      await userEvent.type(screen.getByRole('combobox', { name: 'stripes-acq-components.label.tags' }), newTagLabel);
    });
    await act(async () => {
      await userEvent.click(screen.getByText('stripes-acq-components.addTagFor'));
    });

    expect(createTagMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        label: newTagLabel,
      }),
    });
  });
});
