import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';

import { useShowCallout } from '../../hooks';
import {
  useGoBack,
  useRoutingListMutation,
} from '../hooks';
import { RoutingListForm } from '../RoutingListForm';
import { handleRoutingListError } from '../utils';

const DEFAULT_INITIAL_VALUES = {
  userIds: [],
};

export const RoutingListCreate = ({ fallbackPath }) => {
  const showCallout = useShowCallout();
  const { poLineId } = useParams();
  const onClose = useGoBack(fallbackPath);
  const { createRoutingList } = useRoutingListMutation();

  const onSubmit = (values) => {
    return createRoutingList({ ...values, poLineId })
      .then(() => {
        onClose();
        showCallout({ messageId: 'stripes-acq-components.routing.list.create.success' });
      }).catch((error) => {
        handleRoutingListError({
          error,
          showCallout,
          messageId: 'stripes-acq-components.routing.list.create.error',
        });
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

RoutingListCreate.propTypes = {
  fallbackPath: PropTypes.string.isRequired,
};
