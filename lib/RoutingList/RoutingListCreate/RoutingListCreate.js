import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';

import { useShowCallout } from '../../hooks';
import {
  useGoBack,
  useRoutingListMutation,
} from '../hooks';
import { handleRoutingListError } from '../utils';
import { RoutingListForm } from '../RoutingListForm';

const DEFAULT_INITIAL_VALUES = {
  userIds: [],
};

export const RoutingListCreate = () => {
  const showCallout = useShowCallout();
  const { poLineId } = useParams();
  const onClose = useGoBack(poLineId);
  const { createRoutingList } = useRoutingListMutation();

  const onSubmit = async (values) => {
    return createRoutingList({ ...values, poLineId }, {
      onSuccess: () => {
        onClose();
        showCallout({ messageId: 'stripes-acq-components.routing.list.create.success' });
      },
      onError: (error) => handleRoutingListError({
        error,
        showCallout,
        messageId: 'stripes-acq-components.routing.list.create.error',
      }),
    });
  };

  return (
    <RoutingListForm
      onCancel={onClose}
      onDelete={noop}
      onSubmit={onSubmit}
      initialValues={DEFAULT_INITIAL_VALUES}
      paneTitle={<FormattedMessage id="stripes-acq-components.routing.list.create.label" />}
    />
  );
};
