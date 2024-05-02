import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  Badge,
  Button,
  Dropdown,
  DropdownMenu,
  Loading,
  MenuSection,
} from '@folio/stripes/components';

import {
  columnMapping,
  columnWidths,
  CREATE_ROUTING_LIST_URL,
  ROUTING_LIST_ACCORDION_ID,
  routingListFormatter,
  visibleColumns,
} from './constants';
import { useRoutingList } from './hooks';
import { RoutingListTable } from './RoutingListTable';

export const RoutingList = ({
  actionMenu,
  disabled,
  poLineId,
  columnWidths: columnWidthsProp,
  allowedNumberOfRoutingLists,
  createButtonLabel,
}) => {
  const intl = useIntl();

  const { isLoading, routingLists } = useRoutingList(poLineId);

  const createRoutingListUrl = `${CREATE_ROUTING_LIST_URL}/${poLineId}`;
  const isCreateButtonDisabled = disabled || allowedNumberOfRoutingLists === routingLists.length;

  const defaultActionMenu = useMemo(() => (
    <Dropdown
      label={<FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />}
      buttonProps={{ buttonStyle: 'primary' }}
      modifiers={{
        preventOverflow: { boundariesElement: 'scrollParent' },
      }}
    >
      <DropdownMenu>
        <MenuSection
          label={intl.formatMessage({ id: 'stripes-components.paneMenuActionsToggleLabel' })}
          id="routing-list-menu-actions"
        >
          <Button
            data-test-routing-list-button
            to={createRoutingListUrl}
            buttonStyle="dropdownItem"
            disabled={isCreateButtonDisabled}
          >
            {createButtonLabel}
          </Button>
        </MenuSection>
      </DropdownMenu>
    </Dropdown>
  ), [createButtonLabel, createRoutingListUrl, intl, isCreateButtonDisabled]);

  const createButton = (
    <Button
      marginBottom0
      to={createRoutingListUrl}
      disabled={isCreateButtonDisabled}
    >
      {createButtonLabel}
    </Button>
  );

  const actionMenuComponent = routingLists.length
    ? actionMenu || defaultActionMenu
    : createButton;

  return (
    <Accordion
      displayWhenClosed={(
        <Badge>
          <span data-test-routing-list-accordion-quantity-indicator>
            {routingLists.length}
          </span>
        </Badge>
      )}
      displayWhenOpen={actionMenuComponent}
      closedByDefault={!routingLists.length}
      id={ROUTING_LIST_ACCORDION_ID}
      label={intl.formatMessage({ id: 'stripes-acq-components.routing.list.label' })}
    >
      {
        isLoading
          ? (
            <Loading />
          )
          : (
            <RoutingListTable
              columnMapping={columnMapping}
              contentData={routingLists}
              formatter={routingListFormatter}
              visibleColumns={visibleColumns}
              columnWidths={columnWidthsProp}
            />
          )
      }
    </Accordion>
  );
};

RoutingList.propTypes = {
  actionMenu: PropTypes.node,
  allowedNumberOfRoutingLists: PropTypes.number,
  columnWidths: PropTypes.object,
  disabled: PropTypes.bool,
  poLineId: PropTypes.string.isRequired,
  createButtonLabel: PropTypes.string,
};

RoutingList.defaultProps = {
  actionMenu: null,
  allowedNumberOfRoutingLists: 0,
  columnWidths,
  createButtonLabel: <FormattedMessage id="stripes-components.button.new" />,
  disabled: false,
};
