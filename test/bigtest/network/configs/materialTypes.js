import { MATERIAL_TYPE_API } from '../../../../lib';

const configMaterialTypes = server => {
  server.get(MATERIAL_TYPE_API, 'materialType');
};

export default configMaterialTypes;
