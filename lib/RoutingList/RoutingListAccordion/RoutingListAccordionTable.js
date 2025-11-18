import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import { acqRowFormatter } from '../../utils';
import {
  alignRowProps,
  columnMapping,
  visibleColumns,
} from './constants';

export const RoutingListAccordionTable = ({
  columnMapping: columnMappingProp = columnMapping,
  contentData,
  formatter,
  id = 'routing-list-table',
  visibleColumns: visibleColumnsProp = visibleColumns,
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

RoutingListAccordionTable.propTypes = {
  columnMapping: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  formatter: PropTypes.object.isRequired,
  id: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};
