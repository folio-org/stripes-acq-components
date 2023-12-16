import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  COLUMN_MAPPING,
  COLUMN_NAMES,
} from '../../configs';

export const useLocationsList = ({
  campusesMap,
  institutionsMap,
  isMultiSelect,
  librariesMap,
  selectedLocations,
}) => {
  const intl = useIntl();

  const columnMapping = useMemo(() => ({
    ...COLUMN_MAPPING,
    ...(
      isMultiSelect
        ? { [COLUMN_NAMES.isAssigned]: <FormattedMessage id="stripes-acq-components.find-location.results.column.assignment" /> }
        : {}
    ),
  }), [isMultiSelect]);

  const resultsFormatter = useMemo(() => ({
    [COLUMN_NAMES.name]: ({ name }) => name,
    [COLUMN_NAMES.code]: ({ code }) => code,
    [COLUMN_NAMES.institution]: ({ institutionId }) => institutionsMap[institutionId]?.name,
    [COLUMN_NAMES.campus]: ({ campusId }) => campusesMap[campusId]?.name,
    [COLUMN_NAMES.library]: ({ libraryId }) => librariesMap[libraryId]?.name,
    [COLUMN_NAMES.isActive]: ({ isActive }) => intl.formatMessage({ id: `stripes-acq-components.find-location.results.column.status.${isActive ? 'active' : 'inactive'}` }),
    [COLUMN_NAMES.isAssigned]: ({ id }) => intl.formatMessage({ id: `stripes-acq-components.filter.assignment.${selectedLocations[id] ? 'assigned' : 'unassigned'}` }),
  }), [
    campusesMap,
    institutionsMap,
    intl,
    librariesMap,
    selectedLocations,
  ]);

  return {
    columnMapping,
    resultsFormatter,
  }
}
