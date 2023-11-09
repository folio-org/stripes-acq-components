import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { MultiColumnList } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import {
  alignRowProps,
  defaultColumnMapping,
  defaultVisibleColumns,
} from './constants';
import { getDonorsListFormatter } from './utils';

export const DonorsList = ({
  columnMapping,
  columnWidths,
  contentData,
  formatter: formatterProp,
  id,
  visibleColumns,
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
  id: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsList.defaultProps = {
  columnMapping: defaultColumnMapping,
  visibleColumns: defaultVisibleColumns,
};
