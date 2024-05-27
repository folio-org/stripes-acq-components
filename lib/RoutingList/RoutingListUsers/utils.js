import get from 'lodash/get';

import {
  Button,
  Icon,
  Layout,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';

export const getRoutingListUsersFormatter = ({ onRemoveUser, editable }) => {
  return ({
    orderNumber: record => (
      <>
        <AppIcon app="users" size="small" />
        <Layout className="flex indent">{record.rowIndex + 1}</Layout>
      </>
    ),
    user: record => {
      const { personal, id } = record;
      const address = get(personal, 'addresses[0].addressLine1', '');

      return (
        <Layout className="flex justified full">
          {getFullName(record)}
          {address ? ` - ${address}` : ''}

          {
            editable && (
              <Button
                buttonStyle="fieldControl"
                align="end"
                type="button"
                id={`clickable-remove-user-${id}`}
                onClick={() => onRemoveUser(id)}
              >
                <Icon icon="times-circle" />
              </Button>
            )
          }
        </Layout>
      );
    },
  });
};
