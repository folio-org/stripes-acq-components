import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import { useCategories } from '../hooks';
import { acqRowFormatter } from '../utils';
import {
  alignRowProps,
  defaultColumnMapping,
  defaultVisibleColumns,
} from './constants';
import { getResultsFormatter } from './utils';

const DEFAULT_FIELDS = {};

export const PrivilegedDonorContactsList = ({
  columnMapping = defaultColumnMapping,
  columnWidths,
  contentData,
  fields = DEFAULT_FIELDS,
  formatter: formatterProp,
  id,
  visibleColumns = defaultVisibleColumns,
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
