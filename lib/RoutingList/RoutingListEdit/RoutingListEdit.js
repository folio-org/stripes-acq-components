import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';

import {
  ConfirmationModal,
  LoadingView,
} from '@folio/stripes/components';

import {
  useShowCallout,
  useToggle,
} from '../../hooks';
import {
  useGoBack,
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import { RoutingListForm } from '../RoutingListForm';
import { handleRoutingListError } from '../utils';

export const RoutingListEdit = () => {
  const showCallout = useShowCallout();
  const { id } = useParams();
  const { routingList, isLoading } = useRoutingList(id);
  const onClose = useGoBack(routingList?.poLineId);
  const { deleteRoutingList, updateRoutingList } = useRoutingListMutation();

  const [isDeleteConfirmationVisible, toggleDeleteConfirmation] = useToggle(false);

  const onMutationSuccess = (messageId = 'stripes-acq-components.routing.list.update.success') => {
    onClose();
    showCallout({ messageId });
  };

  const onDelete = async () => {
    toggleDeleteConfirmation();
    await deleteRoutingList(
      routingList.id,
      {
        onSuccess: () => onMutationSuccess('stripes-acq-components.routing.list.delete.success'),
        onError: (error) => handleRoutingListError({
          error,
          showCallout,
          messageId: 'stripes-acq-components.routing.list.delete.error',
        }),
      },
    );
  };

  const onSubmit = (values) => {
    return updateRoutingList(values, {
      onSuccess: () => onMutationSuccess('stripes-acq-components.routing.list.update.success'),
      onError: (error) => handleRoutingListError({
        error,
        showCallout,
        messageId: 'stripes-acq-components.routing.list.update.error',
      }),
    });
  };

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <RoutingListForm
        onCancel={onClose}
        onDelete={toggleDeleteConfirmation}
        onSubmit={onSubmit}
        initialValues={routingList}
        paneTitle={routingList?.name}
      />
      {isDeleteConfirmationVisible && (
        <ConfirmationModal
          id="delete-routing-list-confirmation"
          confirmLabel={<FormattedMessage id="stripes-acq-components.routing.list.delete.confirm.label" />}
          heading={<FormattedMessage id="stripes-acq-components.routing.list.delete.confirm.title" />}
          message={<FormattedMessage id="stripes-acq-components.routing.list.delete.confirm" />}
          onCancel={toggleDeleteConfirmation}
          onConfirm={onDelete}
          open
        />
      )}
    </>
  );
};
