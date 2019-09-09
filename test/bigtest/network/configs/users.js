import { USERS_API } from '../../../../lib';

const configUsers = server => {
  server.get(`${USERS_API}/:id`, (schema, request) => {
    const schemaUser = schema.users.find(request.params.id);

    return (schemaUser || {}).attrs;
  });
};

export default configUsers;
