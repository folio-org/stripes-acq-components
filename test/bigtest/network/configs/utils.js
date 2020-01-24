import { Response } from 'miragejs';

export const createPut = (schemaName) => (schema, request) => {
  const id = request.params.id;
  const attrs = JSON.parse(request.requestBody);

  schema[schemaName].find(id).update(attrs);

  return attrs;
};

export const createPost = (schemaName) => (schema, request) => {
  const attrs = JSON.parse(request.requestBody) || {};

  return schema[schemaName].create(attrs).attrs;
};

export const createGetAll = (schemaName) => (schema) => {
  return schema[schemaName].all();
};

export const createGetById = (schemaName, idParam = 'id') => (schema, request) => {
  const record = schema[schemaName].find(request.params[idParam]);

  return record
    ? record.attrs
    : new Response(404, { errors: 'record is not found' });
};
