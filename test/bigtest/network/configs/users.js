import { Response } from '@bigtest/mirage';

import { USERS_API } from '../../../../lib';

const configUsers = server => {
  server.get(`${USERS_API}/:id`, (schema, request) => {
    const schemaUser = schema.users.find(request.params.id);

    if (!schemaUser) {
      return new Response(404, {
        'X-Okapi-Token': `myOkapiToken:${Date.now()}`,
      }, {});
    }

    return schemaUser.attrs;
  });
};

export default configUsers;
