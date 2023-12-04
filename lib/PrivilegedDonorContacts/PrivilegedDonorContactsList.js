import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import { acqRowFormatter } from '../utils';
import {
  alignRowProps,
  defaultColumnMapping,
  defaultVisibleColumns,
} from './constants';
import { useCategories } from './hooks';
import { getResultsFormatter } from './utils';

export const PrivilegedDonorContactsList = ({
  columnMapping,
  columnWidths,
  contentData,
  formatter: formatterProp,
  id,
  visibleColumns,
  fields,
  ...rest
}) => {
  const intl = useIntl();
  const { categories } = useCategories({ enabled: !formatterProp });

  const formatter = useMemo(() => {
    return formatterProp || getResultsFormatter({ intl, fields, categoriesDict: categories });
  }, [categories, fields, formatterProp, intl]);

  return (
    <MultiColumnList
      id={id}
      columnMapping={columnMapping}
      contentData={contentData}
      formatter={formatter}
      rowFormatter={acqRowFormatter}
      rowProps={alignRowProps}
      visibleColumns={visibleColumns}
      columnWidths={columnWidths}
      {...rest}
    />
  );
};

PrivilegedDonorContactsList.propTypes = {
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  fields: PropTypes.object,
  formatter: PropTypes.object,
  id: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

PrivilegedDonorContactsList.defaultProps = {
  columnMapping: defaultColumnMapping,
  fields: {},
  visibleColumns: defaultVisibleColumns,
};
