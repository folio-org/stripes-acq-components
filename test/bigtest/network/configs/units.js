import { ACQUISITIONS_UNITS_API } from '../../../../lib';
import {
  createGetAll,
  createGetById,
} from './utils';

const SCHEMA_NAME = 'units';

const configUnits = server => {
  server.get(ACQUISITIONS_UNITS_API, createGetAll(SCHEMA_NAME));
  server.get(`${ACQUISITIONS_UNITS_API}/:id`, createGetById(SCHEMA_NAME));
};

export default configUnits;
