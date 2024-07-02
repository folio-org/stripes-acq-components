import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  KeyValue,
  LoadingView,
  Pane,
  Row,
} from '@folio/stripes/components';
import { AppIcon, IfPermission } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  useShowCallout,
  useToggle,
} from '../../hooks';
import { handleKeyCommand } from '../../utils';
import {
  useGoBack,
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import { RoutingListUsers } from '../RoutingListUsers';
import { getAppName } from '../utils';

export const RoutingListView = ({
  fallbackPath,
  routingListUrl,
  tenantId,
}) => {
  const accordionStatusRef = useRef();
  const showCallout = useShowCallout();
  const { id } = useParams();
  const appName = getAppName();

  const [isDeleteConfirmationVisible, toggleDeleteConfirmation] = useToggle(false);

  const { routingList, isLoading } = useRoutingList(id, { tenantId });
  const { deleteRoutingList } = useRoutingListMutation({ tenantId });
  const onClose = useGoBack(fallbackPath);

  const onDelete = () => {
    toggleDeleteConfirmation();

    return deleteRoutingList(routingList.id)
      .then(() => {
        onClose();
        showCallout({
          messageId: 'stripes-acq-components.routing.list.delete.success',
        });
      })
      .catch(() => {
        showCallout({
          messageId: 'stripes-acq-components.routing.list.delete.error',
          type: 'error',
        });
      });
  };

  const getActionMenu = () => {
    return (
      <>
        <IfPermission perm="orders.routing-lists.item.put">
          <Button
            buttonStyle="dropdownItem"
            to={`${routingListUrl}/edit/${routingList.id}`}
          >
            <Icon icon="edit">
              <FormattedMessage id="stripes-acq-components.routing.list.actions.edit" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="orders.routing-lists.item.delete">
          <Button
            data-testid="delete-routing-list"
            buttonStyle="dropdownItem"
            onClick={toggleDeleteConfirmation}
          >
            <Icon icon="trash">
              <FormattedMessage id="stripes-acq-components.routing.list.actions.delete" />
            </Icon>
          </Button>
        </IfPermission>
      </>
    );
  };

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onClose),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        id="routing-list-pane"
        appIcon={<AppIcon app={appName} appIconKey={appName} />}
        defaultWidth="fill"
        paneTitle={routingList.name}
        dismissible
        onClose={onClose}
        actionMenu={getActionMenu}
      >
        <AccordionStatus>
          <Row end="xs">
            <Col data-test-expand-all>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <Accordion label={<FormattedMessage id="stripes-acq-components.routing.list.generalInformation" />}>
              <AccordionSet>
                {routingList.metadata && <ViewMetaData metadata={routingList.metadata} />}
              </AccordionSet>
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="stripes-acq-components.routing.list.name" />}
                    value={routingList.name}
                  />
                </Col>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="stripes-acq-components.routing.list.notes" />}
                    value={routingList.notes}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion label={<FormattedMessage id="stripes-acq-components.routing.list.users" />}>
              <RoutingListUsers ids={routingList.userIds} />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
      </Pane>
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
    </HasCommand>
  );
};

RoutingListView.propTypes = {
  fallbackPath: PropTypes.string.isRequired,
  routingListUrl: PropTypes.string.isRequired,
  tenantId: PropTypes.string,
};
