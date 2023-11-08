import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

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
  formatter,
  id,
  visibleColumns,
}) => {
  const stripes = useStripes();
  const canViewOrganizations = stripes.hasPerm('ui-organizations.view');
  const defaultFormatter = isEmpty(formatter) || getDonorsListFormatter({ canViewOrganizations });

  return (
    <MultiColumnList
      id={id}
      columnMapping={columnMapping}
      contentData={contentData}
      formatter={defaultFormatter}
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
