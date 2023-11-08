import PropTypes from 'prop-types';

import { MultiColumnList } from '@folio/stripes/components';

import {
  alignRowProps,
  defaultColumnMapping,
  defaultVisibleColumns,
} from './constants';

const DonorsList = ({
  columnMapping,
  columnWidths,
  contentData,
  formatter,
  id,
  visibleColumns,
}) => {
  return (
    <MultiColumnList
      id={id}
      columnMapping={columnMapping}
      contentData={contentData}
      formatter={formatter}
      rowProps={alignRowProps}
      visibleColumns={visibleColumns}
      columnWidths={columnWidths}
    />
  );
};

DonorsList.propTypes = {
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  formatter: PropTypes.object,
  id: PropTypes.string.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsList.defaultProps = {
  columnMapping: defaultColumnMapping,
  visibleColumns: defaultVisibleColumns,
};

export default DonorsList;
