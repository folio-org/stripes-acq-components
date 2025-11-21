import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
    useTags.mockReturnValue({ tags: TAGS });
    useTagsConfigs.mockReturnValue({ configs: [], isFetched: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display Tags filter', () => {
    renderAcqTagsFilter({ onChange });

    expect(screen.getByText(TAGS_FILTER_LABEL)).toBeInTheDocument();
  });

  it('should call onChange', async () => {
    renderAcqTagsFilter({
      onChange,
      resources: {
        tagsFilter: {
          records: TAGS,
        },
      },
    });

    await act(async () => {
      await userEvent.click(screen.getByText('tag 1'));
    });

    expect(onChange).toHaveBeenCalledWith({ name: 'tags-filter', values: ['tag 1'] });
  });
});
