import { ACQUISITIONS_UNITS_API } from '../constants';
import { fetchExportDataByIds } from './fetchExportDataByIds';

export const getAcqUnitsByIds = (ky) => async (acquisitionUnitIds) => {
  return fetchExportDataByIds({
    api: ACQUISITIONS_UNITS_API,
    ids: acquisitionUnitIds,
    ky,
    records: 'acquisitionsUnits',
  });
};
