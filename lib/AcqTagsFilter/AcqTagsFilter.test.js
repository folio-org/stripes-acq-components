import {
  render,
  screen,
} from '@testing-library/react';
import user from '@testing-library/user-event';

import {
  useTags,
  useTagsConfigs,
} from '../hooks';
import AcqTagsFilter from './AcqTagsFilter';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useTags: jest.fn(),
  useTagsConfigs: jest.fn(),
}));

const TAGS_FILTER_LABEL = 'stripes-acq-components.filter.tags';
const TAGS = [{
  id: 'tag1',
  label: 'tag 1',
}];

const renderAcqTagsFilter = (props = {}) => render(
  <AcqTagsFilter
    id="tags-filter"
    name="tags-filter"
    {...props}
  />,
);

describe('AcqTagsFilter', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
    useTags
      .mockClear()
      .mockReturnValue({ tags: TAGS });
    useTagsConfigs
      .mockClear()
      .mockReturnValue({ configs: [], isFetched: true });
  });

  it('should display Tags filter', () => {
    renderAcqTagsFilter({ onChange });
    expect(screen.getByText(TAGS_FILTER_LABEL)).toBeDefined();
  });

  it('should call onChange', () => {
    renderAcqTagsFilter({ onChange, resources: { tagsFilter: { records: TAGS } } });
    user.click(screen.getByText('tag 1'));
    expect(onChange).toHaveBeenCalledWith({ name: 'tags-filter', values: ['tag 1'] });
  });
});
