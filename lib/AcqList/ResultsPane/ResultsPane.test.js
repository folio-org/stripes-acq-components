import { render } from '@folio/jest-config-stripes/testing-library/react';

import { getFiltersCount } from '../utils';

import ResultsPane, { UNKNOWN_RECORDS_COUNT } from './ResultsPane';

jest.mock('../utils', () => ({
  getFiltersCount: jest.fn().mockReturnValue(1),
}));

const RESULTS = 'Results';
const TITLE = 'Entities';

const renderResultsPane = (props = {
  title: TITLE,
}) => (render(
  <ResultsPane
    {...props}
  >
    {RESULTS}
  </ResultsPane>,
));

describe('ResultsPane', () => {
  it('should display passed children', () => {
    const { getByText } = renderResultsPane();

    expect(getByText(RESULTS)).toBeInTheDocument();
  });

  describe('Pane left menu', () => {
    const filtersCount = 14;

    beforeEach(() => {
      getFiltersCount.mockClear().mockReturnValue(filtersCount);
    });

    it('should display filters count when filters are closed', () => {
      const { getByText } = renderResultsPane({ isFiltersOpened: false, title: TITLE });

      expect(getByText(filtersCount)).toBeInTheDocument();
    });

    it('should not display filters count when filters are opened', () => {
      const { queryByText } = renderResultsPane({ isFiltersOpened: true, title: TITLE });

      expect(queryByText(filtersCount)).not.toBeInTheDocument();
    });
  });

  describe('Pane right menu', () => {
    it('should be rendered when defined', () => {
      const renderLastMenu = jest.fn();

      renderResultsPane({ title: TITLE, renderLastMenu });

      expect(renderLastMenu).toHaveBeenCalled();
    });
  });

  describe('Pane title', () => {
    it('should display passed title value', () => {
      const { getByText } = renderResultsPane({ title: TITLE });

      expect(getByText(TITLE)).toBeInTheDocument();
    });

    it('should display "Enter search criterias" label in subtitle when no filters and no results', () => {
      getFiltersCount.mockClear().mockReturnValue(0);

      const { getByText } = renderResultsPane();

      expect(getByText('stripes-smart-components.searchCriteria')).toBeInTheDocument();
    });

    it('should display results header when filters are selected and count is known', () => {
      getFiltersCount.mockClear().mockReturnValue(2);

      const { getByText } = renderResultsPane();

      expect(getByText('stripes-smart-components.searchResultsCountHeader')).toBeInTheDocument();
    });

    it('should display results header with unkown count when filters are selected and count is unknown', () => {
      getFiltersCount.mockClear().mockReturnValue(2);

      const { getByText } = renderResultsPane({ title: TITLE, count: UNKNOWN_RECORDS_COUNT });

      expect(getByText('stripes-smart-components.searchResultsCountUnknown')).toBeInTheDocument();
    });

    it('should display custom sub title when passed', () => {
      const subTitle = 'View and manage entities';
      const { getByText } = renderResultsPane({ title: TITLE, subTitle });

      expect(getByText(subTitle)).toBeInTheDocument();
    });
  });
});
