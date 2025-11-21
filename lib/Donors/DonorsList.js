import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { MultiColumnList } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { acqRowFormatter } from '../utils';
import {
  alignRowProps,
  defaultColumnMapping,
  defaultVisibleColumns,
} from './constants';
import { getDonorsListFormatter } from './utils';

export const DonorsList = ({
  columnMapping = defaultColumnMapping,
  columnWidths,
  contentData,
  formatter: formatterProp,
  id,
  visibleColumns = defaultVisibleColumns,
  ...rest
}) => {
  const stripes = useStripes();
  const canViewOrganizations = stripes.hasPerm('ui-organizations.view');
  const formatter = useMemo(() => {
    return formatterProp || getDonorsListFormatter({ canViewOrganizations });
  }, [canViewOrganizations, formatterProp]);

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

DonorsList.propTypes = {
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  formatter: PropTypes.object,
  id: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};
