import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import AutoSizer from 'react-virtualized-auto-sizer';

import {
  Pane,
  SRStatus,
} from '@folio/stripes/components';

import { useResultsSRStatus } from '../hooks';
import { getFiltersCount } from '../utils';
import FilterPaneToggle from './FilterPaneToggle';

export const UNKNOWN_RECORDS_COUNT = 999999999;

const ResultsPane = ({
  id,
  children,
  width,
  title,
  subTitle,
  isLoading,
  count,
  renderLastMenu,
  toggleFiltersPane,
  filters,
  isFiltersOpened,
  resultsPaneTitleRef,
  renderActionMenu,
  autosize,
}) => {
  let paneSub;
  const hasFilters = getFiltersCount(filters) > 0;

  const { readerStatusRef } = useResultsSRStatus({ isLoading, hasFilters, resultsCount: count });

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

  const renderContent = (isAutosized, content) => {
    return isAutosized
      ? (
        <AutoSizer>
          {size => (
            <div style={{ width: size.width }}>
              {content(size)}
            </div>
          )}
        </AutoSizer>
      )
      : content;
  };

  return (
    <Pane
      id={id}
      defaultWidth={width}
      data-test-results-pane
      paneTitle={title}
      paneTitleRef={resultsPaneTitleRef}
      paneSub={subTitle || paneSub}
      padContent={false}
      noOverflow
      firstMenu={firstMenu}
      lastMenu={renderLastMenu && renderLastMenu()}
      actionMenu={renderActionMenu}
    >
      {renderContent(autosize, children)}

      <SRStatus ref={readerStatusRef} />
    </Pane>
  );
};

ResultsPane.propTypes = {
  id: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node,
  width: PropTypes.string,
  isLoading: PropTypes.bool,
  count: PropTypes.number,
  renderLastMenu: PropTypes.func,
  toggleFiltersPane: PropTypes.func,
  filters: PropTypes.object,
  isFiltersOpened: PropTypes.bool,
  resultsPaneTitleRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderActionMenu: PropTypes.func,
  autosize: PropTypes.bool,
};

ResultsPane.defaultProps = {
  width: 'fill',
  subTitle: '',
  count: 0,
  autosize: false,
  isLoading: false,
};

export default ResultsPane;
