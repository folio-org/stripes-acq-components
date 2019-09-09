import { VENDORS_API } from '../../../../lib';

const configVendors = server => {
  server.get(VENDORS_API, (schema) => {
    return schema.vendors.all();
  });

  server.get(`${VENDORS_API}/:id`, (schema, request) => {
    const schemaVendor = schema.vendors.find(request.params.id);

    return (schemaVendor || {}).attrs;
  });
};

export default configVendors;
