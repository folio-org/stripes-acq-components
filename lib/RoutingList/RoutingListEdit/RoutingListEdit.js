import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useParams, useLocation, useHistory } from 'react-router-dom';

import {
  ConfirmationModal,
  LoadingView,
} from '@folio/stripes/components';

import {
  useShowCallout,
  useToggle,
} from '../../hooks';
import {
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import { RoutingListForm } from '../RoutingListForm';
import { handleRoutingListError } from '../utils';

export const RoutingListEdit = ({
  routingListUrl,
  tenantId,
}) => {
  const history = useHistory();
  const location = useLocation();

  const showCallout = useShowCallout();
  const { id } = useParams();
  const { routingList, isLoading } = useRoutingList(id, { tenantId });
  const { deleteRoutingList, updateRoutingList } = useRoutingListMutation({ tenantId });

  const [isDeleteConfirmationVisible, toggleDeleteConfirmation] = useToggle(false);

  const onClose = () => history.push(`${routingListUrl}/view/${id}${location.search}`);

  const onMutationSuccess = (messageId = 'stripes-acq-components.routing.list.update.success') => {
    onClose();
    showCallout({ messageId });
  };

  const onDelete = () => {
    toggleDeleteConfirmation();

    return deleteRoutingList(routingList.id)
      .then(() => {
        onMutationSuccess('stripes-acq-components.routing.list.delete.success');
      })
      .catch((error) => {
        handleRoutingListError({
          error,
          showCallout,
          messageId: 'stripes-acq-components.routing.list.delete.error',
        });
      });
  };

  const onSubmit = (values) => {
    return updateRoutingList(values)
      .then(() => {
        onMutationSuccess('stripes-acq-components.routing.list.update.success');
      })
      .catch((error) => {
        handleRoutingListError({
          error,
          showCallout,
          messageId: 'stripes-acq-components.routing.list.update.error',
        });
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
      <ConfirmationModal
        id="delete-routing-list-confirmation"
        confirmLabel={<FormattedMessage id="stripes-acq-components.routing.list.delete.confirm.label" />}
        heading={<FormattedMessage id="stripes-acq-components.routing.list.delete.confirm.title" />}
        message={<FormattedMessage id="stripes-acq-components.routing.list.delete.confirm" />}
        onCancel={toggleDeleteConfirmation}
        onConfirm={onDelete}
        open={isDeleteConfirmationVisible}
      />
    </>
  );
};

RoutingListEdit.propTypes = {
  routingListUrl: PropTypes.string.isRequired,
  tenantId: PropTypes.string,
};
