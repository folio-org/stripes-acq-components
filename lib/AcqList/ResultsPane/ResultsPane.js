import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
} from '@folio/stripes/components';

import { getFiltersCount } from '../utils';
import FilterPaneToggle from './FilterPaneToggle';

const UNKNOWN_RECORDS_COUNT = 999999999;

const ResultsPane = ({
  children,
  width,
  title,
  subTitle,
  count,
  renderLastMenu,
  toggleFiltersPane,
  filters,
  isFiltersOpened,
}) => {
  let paneSub;
  const hasFilters = getFiltersCount(filters) > 0;

  if (hasFilters || count) {
    if (count === UNKNOWN_RECORDS_COUNT) {
      paneSub = <FormattedMessage id="stripes-smart-components.searchResultsCountUnknown" />;
    } else {
      paneSub = <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }
  } else {
    paneSub = <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  const firstMenu = isFiltersOpened
    ? undefined
    : (
      <FilterPaneToggle
        filters={filters}
        toggleFiltersPane={toggleFiltersPane}
      />
    );

  return (
    <Pane
      defaultWidth={width}
      data-test-results-pane
      paneTitle={title}
      paneSub={subTitle || paneSub}
      padContent={false}
      noOverflow
      firstMenu={firstMenu}
      lastMenu={renderLastMenu && renderLastMenu()}
    >
      {children}
    </Pane>
  );
};

ResultsPane.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node,
  width: PropTypes.string,
  count: PropTypes.number,
  renderLastMenu: PropTypes.func,
  toggleFiltersPane: PropTypes.func,
  filters: PropTypes.object,
  isFiltersOpened: PropTypes.bool,
};

ResultsPane.defaultProps = {
  width: 'fill',
  subTitle: '',
  count: 0,
};

export default ResultsPane;
