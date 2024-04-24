import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import { acqRowFormatter } from '../utils';
import {
  alignRowProps,
  columnMapping,
  routingListFormatter,
  visibleColumns,
} from './constants';

export const RoutingListTable = ({
  columnMapping: columnMappingProp,
  contentData,
  formatter,
  id,
  visibleColumns: visibleColumnsProp,
  ...rest
}) => {
  return (
    <MultiColumnList
      id={id}
      columnMapping={columnMappingProp}
      contentData={contentData}
      formatter={formatter}
      rowFormatter={acqRowFormatter}
      rowProps={alignRowProps}
      visibleColumns={visibleColumnsProp}
      isEmptyMessage={<FormattedMessage id="stripes-acq-components.routing.list.noRoutingLists" />}
      {...rest}
    />
  );
};

RoutingListTable.propTypes = {
  columnMapping: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  formatter: PropTypes.object,
  id: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

RoutingListTable.defaultProps = {
  columnMapping,
  formatter: routingListFormatter,
  id: 'routing-list-table',
  visibleColumns,
};
