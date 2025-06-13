import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import TagsContainer from './TagsContainer';

const TAGS = [{ id: 'tag1', label: 'tag-1' }];

const renderComponent = (props = {}) => (render(
  <TagsContainer
    {...props}
  />,
));

describe('TagsContainer', () => {
  const mutator = {
    tags: {
      POST: jest.fn().mockResolvedValue(),
    },
  };
  const resources = { tags: { hasLoaded: true, records: TAGS } };
  const recordObj = { tags: { tagList: [] } };
  const putMutator = jest.fn().mockResolvedValue();
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading', async () => {
    const { container } = renderComponent({ recordObj, mutator, putMutator, onClose });

    await waitFor(() => expect(container.querySelector('.spinner')).toBeDefined());
  });

  it('should call update entity on unassign tag', async () => {
    renderComponent({ recordObj: { tags: { tagList: ['tag-1'] } }, mutator, putMutator, onClose, resources });
    await waitFor(() => expect(screen.getByText('1 item selected')).toBeDefined());

    await userEvent.click(screen.getByLabelText('times'));

    await waitFor(() => expect(putMutator).toHaveBeenCalledWith({ tags: { tagList: [] } }));
  });

  it('should call update entity on assign new tag', async () => {
    renderComponent({ recordObj, mutator, putMutator, onClose, resources });
    await waitFor(() => expect(screen.getByText('tag-1')).toBeDefined());
    const tag1 = await screen.getByText('tag-1');

    await userEvent.click(tag1);

    await waitFor(() => expect(putMutator).toHaveBeenCalled());
  });

  it('should call update entity on add new tag', async () => {
    renderComponent({ recordObj, mutator, putMutator, onClose, resources });
    await waitFor(() => expect(screen.getByText('tag-1')).toBeDefined());

    await userEvent.type(screen.getByPlaceholderText('stripes-smart-components.enterATag'), 'new tag');
    await userEvent.click(screen.getByText('+'));

    expect(mutator.tags.POST).toHaveBeenCalledWith({
      description: 'newtag',
      label: 'newtag',
    });
    await waitFor(() => expect(putMutator).toHaveBeenCalled());
  });
});
