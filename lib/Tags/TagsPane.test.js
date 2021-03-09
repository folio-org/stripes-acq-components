import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import TagsPane from './TagsPane';

const TAGS = [{ id: 'tag1', label: 'tag-1' }];

const renderComponent = (props = {}) => (render(
  <TagsPane
    {...props}
  />,
));

describe('TagsPane', () => {
  const mutator = {
    tagsPaneTags: {
      GET: jest.fn().mockResolvedValue(TAGS),
      POST: jest.fn().mockResolvedValue(),
    },
  };
  const entity = { tags: { tagList: [] } };
  const updateEntity = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    updateEntity.mockClear();
    onClose.mockClear();
    mutator.tagsPaneTags.POST.mockClear();
  });

  it('should display loading', async () => {
    const { container } = renderComponent({ entity, mutator, updateEntity, onClose });

    await waitFor(() => expect(container.querySelector('.spinner')).toBeDefined());
  });

  it('should call update entity on unassign tag', async () => {
    renderComponent({ entity: { tags: { tagList: ['tag-1'] } }, mutator, updateEntity, onClose });
    await waitFor(() => expect(screen.getByText('1 item selected')).toBeDefined());

    user.click(screen.getByLabelText('times'));

    await waitFor(() => expect(updateEntity).toHaveBeenCalledWith({ tags: { tagList: [] } }));
  });

  it('should call update entity on assign new tag', async () => {
    renderComponent({ entity, mutator, updateEntity, onClose });
    await waitFor(() => expect(screen.getByText('tag-1')).toBeDefined());
    const tag1 = await screen.getByText('tag-1');

    user.click(tag1);
    await waitFor(() => expect(updateEntity).toHaveBeenCalled());
  });

  it('should call update entity on add new tag', async () => {
    renderComponent({ entity, mutator, updateEntity, onClose });
    await waitFor(() => expect(screen.getByText('tag-1')).toBeDefined());

    user.type(screen.getByPlaceholderText('stripes-smart-components.enterATag'), 'new tag');
    user.click(screen.getByText('+'));

    expect(mutator.tagsPaneTags.POST).toHaveBeenCalledWith({
      description: 'newtag',
      label: 'newtag',
    });
    await waitFor(() => expect(updateEntity).toHaveBeenCalled());
  });
});
