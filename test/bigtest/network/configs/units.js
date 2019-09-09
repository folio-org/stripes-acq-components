import { ACQUISITIONS_UNITS_API } from '../../../../lib';

const configUnits = server => {
  server.get(ACQUISITIONS_UNITS_API, (schema) => {
    return schema.units.all();
  });
};

export default configUnits;
