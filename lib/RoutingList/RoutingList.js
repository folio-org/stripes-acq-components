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
  CREATE_ROUTING_LIST_URL,
  ROUTING_LIST_ACCORDION_ID,
  routingListFormatter,
  visibleColumns,
} from './constants';
import { useRoutingList } from './hooks';
import { RoutingListTable } from './RoutingListTable';

export const RoutingList = ({ actionMenu, disabled, poLineId }) => {
  const intl = useIntl();

  const { isLoading, routingLists } = useRoutingList(poLineId);

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
            to={CREATE_ROUTING_LIST_URL}
            buttonStyle="dropdownItem"
            disabled={disabled}
          >
            <FormattedMessage id="stripes-core.button.new" />
          </Button>
        </MenuSection>
      </DropdownMenu>
    </Dropdown>
  ), [disabled, intl]);

  const createButton = (
    <Button
      marginBottom0
      to={CREATE_ROUTING_LIST_URL}
      disabled={disabled}
    >
      <FormattedMessage id="stripes-components.button.new" />
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
            />
          )
      }
    </Accordion>
  );
};

RoutingList.propTypes = {
  actionMenu: PropTypes.node,
  disabled: PropTypes.bool,
  poLineId: PropTypes.string.isRequired,
};

RoutingList.defaultProps = {
  actionMenu: null,
  disabled: false,
};
