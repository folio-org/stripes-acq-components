import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FieldTagsFinal from './FieldTagsFinal';
import FieldTagsContainer from './FieldTagsContainer';

const TAGS = [{ id: '1', label: 'tag1' }, { id: '2', label: 'tag2' }];

jest.mock('./FieldTagsFinal', () => {
  return jest.fn(() => 'FieldTagsFinal');
});

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FieldTagsContainer
      formValues={{}}
      name="tags"
      resources={{
        configTags: { records: [{ value: 'true' }] },
        tags: { records: TAGS },
      }}
      {...props}
    />
  </MemoryRouter>,
));

describe('FieldTagsContainer', () => {
  const mutator = { tags: { POST: jest.fn() } };

  beforeEach(() => {
    FieldTagsFinal.mockClear();
    mutator.tags.POST.mockClear();
  });

  it('should not render field if tags not enabled in settings', () => {
    renderComponent({ resources: { configTags: { records: [{ value: '' }] } } });
    expect(screen.queryByText('FieldTagsFinal')).toBeNull();
  });

  it('should load and pass tags', () => {
    renderComponent();
    expect(FieldTagsFinal.mock.calls[0][0].allTags).toEqual(TAGS);
  });

  it('should call POST API on adding new tag', () => {
    renderComponent({ mutator });
    FieldTagsFinal.mock.calls[0][0].onAdd();

    expect(mutator.tags.POST).toHaveBeenCalled();
  });
});
