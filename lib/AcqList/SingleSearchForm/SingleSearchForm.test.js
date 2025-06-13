import { render } from '@folio/jest-config-stripes/testing-library/react';
import { SearchField } from '@folio/stripes/components';

import SingleSearchForm from './SingleSearchForm';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  SearchField: jest.fn(() => 'SearchField'),
}));

const renderSingleSearchForm = ({
  applySearch = jest.fn(),
  changeSearch = jest.fn(),
  ariaLabelId = 'search',
  searchableIndexes,
} = {}) => (render(
  <SingleSearchForm
    applySearch={applySearch}
    changeSearch={changeSearch}
    ariaLabelId={ariaLabelId}
    searchableIndexes={searchableIndexes}
  />,
));

describe('SingleSearchForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should apply search when form is submitted', () => {
    const applySearch = jest.fn();
    const { getByTestId } = renderSingleSearchForm({ applySearch });

    getByTestId('search-form').submit();

    expect(applySearch).toHaveBeenCalled();
  });

  describe('Search field', () => {
    it('should be displaed', () => {
      const { getByText } = renderSingleSearchForm();

      expect(getByText('SearchField')).toBeDefined();
    });

    it('should change search to empty when field is cleared', () => {
      const changeSearch = jest.fn();

      renderSingleSearchForm({ changeSearch });

      SearchField.mock.calls[0][0].onClear();

      expect(changeSearch.mock.calls[0][0].target.value).toBe('');
    });

    it('should change search to empty when field is changed', () => {
      const changeSearch = jest.fn();

      renderSingleSearchForm({ changeSearch });

      SearchField.mock.calls[0][0].onChange();

      expect(changeSearch).toHaveBeenCalled();
    });

    it('should not display indexes when searchableIndexes are not defined', () => {
      renderSingleSearchForm();

      expect(SearchField.mock.calls[0][0].searchableIndexes).not.toBeDefined();
    });

    it('should display translated indexes when searchableIndexes are defined', () => {
      const searchableIndexes = [
        {
          labelId: 'acq.title',
          placeholderId: 'acq.title',
        },
        {
          label: 'Id',
          placeholder: 'Id',
        },
      ];

      renderSingleSearchForm({ searchableIndexes });

      expect(SearchField.mock.calls[SearchField.mock.calls.length - 1][0].searchableIndexes)
        .toEqual(
          searchableIndexes.map(i => ({
            label: i.label || i.labelId,
            placeholder: i.placeholder || i.placeholderId,
          })),
        );
    });
  });
});
