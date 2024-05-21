import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useReactToPrint } from 'react-to-print';

import {
  Accordion,
  Badge,
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  Loading,
  MenuSection,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

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
import { getRoutingListTemplateContent } from './utils';

export const RoutingList = ({
  actionMenu,
  canPrint,
  disabled,
  poLineId,
  columnWidths: columnWidthsProp,
  allowedNumberOfRoutingLists,
  createButtonLabel,
}) => {
  const intl = useIntl();
  const ky = useOkapiKy();

  const templateRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => templateRef.current,
    pageStyle: `
      @media print {
        html, body {
          height: initial !important;
          overflow: initial !important;
          -webkit-print-color-adjust: exact;
        }
      }
      
      @media print {
        .page-break {
          margin-top: 1rem;
          display: block;
          clear: both;
          page-break-after: always;
        }
      }
    `,
  });

  const { isLoading, routingLists } = useRoutingList(poLineId);

  const createRoutingListUrl = `${CREATE_ROUTING_LIST_URL}/${poLineId}`;
  const isCreateButtonDisabled = disabled || allowedNumberOfRoutingLists === routingLists.length;

  const onPrintRoutingList = useCallback(async () => {
    const templateContent = await getRoutingListTemplateContent(ky, routingLists);

    templateRef.current = templateContent;
    handlePrint();
  }, [ky, routingLists, handlePrint]);

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
            <Icon size="small" icon="plus-sign">
              {createButtonLabel}
            </Icon>
          </Button>
          {
            canPrint && (
              <Button
                data-test-routing-list-print-button
                buttonStyle="dropdownItem"
                onClick={onPrintRoutingList}
              >
                <Icon size="small" icon="print">
                  <FormattedMessage id="ui-receiving.title.details.button.printRoutingList" />
                </Icon>
              </Button>
            )
          }
        </MenuSection>
      </DropdownMenu>
    </Dropdown>
  ), [canPrint, createButtonLabel, createRoutingListUrl, intl, isCreateButtonDisabled, onPrintRoutingList]);

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

  if (isLoading) {
    return <Loading />;
  }

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
      <RoutingListTable
        columnMapping={columnMapping}
        contentData={routingLists}
        formatter={routingListFormatter}
        visibleColumns={visibleColumns}
        columnWidths={columnWidthsProp}
      />
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
  canPrint: PropTypes.bool,
};

RoutingList.defaultProps = {
  actionMenu: null,
  allowedNumberOfRoutingLists: 0,
  columnWidths,
  createButtonLabel: <FormattedMessage id="stripes-components.button.new" />,
  disabled: false,
  canPrint: false,
};
