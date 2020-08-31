import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import {
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';

import { AcqEndOfList } from '../AcqEndOfList';
import {
  ASC_DIRECTION,
  DESC_DIRECTION,
} from '../AcqList';
import { acqRowFormatter } from '../utils';

const alignRowProps = { alignLastColToEnd: true };

const FrontendSortingMCL = ({
  columnMapping,
  contentData,
  formatter,
  hasArrow,
  sortDirection,
  sortedColumn,
  sorters,
  visibleColumns,
  ...rest
}) => {
  const resultsFormatter = useMemo(() => ({
    ...formatter,
    arrow: () => <Icon icon="caret-right" />,
  }), [formatter]);
  const mapping = useMemo(() => ({
    ...columnMapping,
    arrow: null,
  }), [columnMapping]);

  const [sortedByColumn, setSortedByColumn] = useState(sortedColumn);
  const [sortOrder, setSortOrder] = useState(sortDirection);
  const sortedRecords = orderBy(contentData, sorters[sortedByColumn], sortOrder === DESC_DIRECTION ? 'desc' : 'asc');

  const changeSorting = useCallback((event, { name }) => {
    if (!sorters[name]) return;
    if (sortedByColumn !== name) {
      setSortedByColumn(name);
      setSortOrder(DESC_DIRECTION);
    } else {
      setSortOrder(sortOrder === DESC_DIRECTION ? ASC_DIRECTION : DESC_DIRECTION);
    }
  }, [sortOrder, sortedByColumn, sorters]);

  const columns = useMemo(() => {
    return hasArrow
      ? [...visibleColumns, 'arrow']
      : visibleColumns;
  }, [hasArrow, visibleColumns]);
  const nonInteractiveHeaders = useMemo(() => columns.filter(col => !sorters[col]), [columns, sorters]);

  return !contentData ? null : (
    <>
      <MultiColumnList
        columnMapping={mapping}
        contentData={sortedRecords}
        formatter={resultsFormatter}
        interactive={hasArrow}
        nonInteractiveHeaders={nonInteractiveHeaders}
        onHeaderClick={changeSorting}
        rowFormatter={acqRowFormatter}
        rowProps={hasArrow ? alignRowProps : undefined}
        sortDirection={sortOrder}
        sortedColumn={sortedByColumn}
        visibleColumns={columns}
        {...rest}
      />
      <AcqEndOfList totalCount={contentData?.length} />
    </>
  );
};

FrontendSortingMCL.propTypes = {
  columnMapping: PropTypes.object.isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object),
  formatter: PropTypes.object,
  hasArrow: PropTypes.bool,
  sortDirection: PropTypes.string,
  sortedColumn: PropTypes.string.isRequired,
  sorters: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

FrontendSortingMCL.defaultProps = {
  formatter: {},
  hasArrow: false,
  sortDirection: ASC_DIRECTION,
};

export default FrontendSortingMCL;
